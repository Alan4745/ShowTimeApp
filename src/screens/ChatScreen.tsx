import {View, Text, StyleSheet, TextInput, FlatList, Image, KeyboardAvoidingView, Platform,
  TouchableOpacity, Keyboard} from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { Image as ImageIcon, ArrowDownCircle, Send } from 'lucide-react-native';
import ScreenLayout from '../components/common/ScreenLayout';
import AttachmentModal from '../components/modals/AttachmentModal';
import MediaViewerModal from '../components/modals/MediaViewerModal';
import LottieIcon from '../components/common/LottieIcon';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone'
import { buildMediaUrl } from '../utils/urlHelpers';
import { generateLocalThumbnail } from '../utils/generateLocalThumbnail';
import { fetchWithTimeout } from '../utils/fetchWithTimeout';

dayjs.extend(utc);
dayjs.extend(timezone);

type Message = {
    id: string;
    sender: 'user' | 'coach' | `admin`;
    text: string;
    timestamp: string;
    fileUrl?: string;
    fileName?: string;
    fileType?: 'image' | 'video' | 'pdf' | 'audio';
    fileThumbnail?: string;
};

type DateSeparator = {
    type: 'date';
    id: string;
    date: string;
};

type ChatItem = Message | DateSeparator;

type ChatScreenRouteProp = RouteProp<
    { Chat: { 
        id: number; 
        name: string; 
        avatar: string; 
        role: 'student' | 'coach' | 'admin' } },
    'Chat'
>;

export default function ChatScreen() {
    const route = useRoute<ChatScreenRouteProp>();
    const { t } = useTranslation();
    const { id, name, avatar, role: recipientRole } = route.params;
    const { token, user } = useAuth();
    const [inputText, setInputText] = useState('');
    const [showScrollButton, setShowScrollButton] = useState(false);
    const [showAttachmentModal, setShowAttachmentModal] = useState(false);
    const [mediaToView, setMediaToView] = useState<null | Message>(null);
    const [initialAttachmentCaption, setInitialAttachmentCaption] = useState("");
    const flatListRef = useRef<FlatList>(null);    
    const [messages, setMessages] = useState<ChatItem[]>([]);
    const [sendingAttachment, setSendingAttachment] = useState(false);    
    

    // Scroll hasta el final
    useEffect(() => {
        const timeout = setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: false });
        }, 100);
        return () => clearTimeout(timeout);
    }, []);
    
    // Utilidad para obtener los endpoints
    const getChatEndpoints = () => {
        const userRole = user?.role;       
        
        if (!userRole || !recipientRole || !id) return { fetchUrl: '', sendUrl: '' };

        if (userRole === 'student') {
            if (recipientRole === 'coach') {
                return {
                    fetchUrl: `/api/v1/chat/messages/coach/${id}/`,
                    sendUrl: `/api/v1/chat/messages/coach/${id}/send/`
                };
            }
            if (recipientRole === 'admin') {
                return {
                    fetchUrl: `/api/v1/chat/messages/support/`,
                    sendUrl: `/api/v1/chat/messages/support/send/`
                };
            }
        }

        if (userRole === 'coach' || userRole === 'admin') {
            if (recipientRole === 'student') {
                return {
                    fetchUrl: `/api/v1/chat/messages/student/${id}/`,
                    sendUrl: `/api/v1/chat/messages/student/${id}/send/`
                };
            }
        }

        if (userRole === 'coach') {
            if (recipientRole === 'admin') {
                return {
                    fetchUrl: `/api/v1/chat/messages/support/`,
                    sendUrl: `/api/v1/chat/messages/support/send/`
                };
            }
        }

        return { fetchUrl: '', sendUrl: '' };
    };

    // Usa fetchMessages para hacer una carga inicial de mensajes, luego cada minuto
    useEffect(() => {
        // Llamada inicial 
        fetchMessages();        

        // Intervalo cada 60 segundos
        const interval = setInterval(() => {
            fetchMessages();
        }, 60000); // 60,000 ms = 1 minuto

        // Limpiar el intervalo al desmontar el componente
        return () => clearInterval(interval);
    }, [id, recipientRole]);

    const fetchMessages = async () => {
        const { fetchUrl } = getChatEndpoints();        
            
        if (!fetchUrl) return;

        try {
            const res = await fetchWithTimeout(fetchUrl);

            if (!res.ok) {
                console.error("Error fetching messages", await res.text());
                return;
            }

            const json = await res.json();            
            const rawMessages = Array.isArray(json) ? json : json.messages;

            // Paso 1: construir los mensaje base
            let backendMessages: Message[] = rawMessages.map((msg: any) => ({
                id: msg.id?.toString(),
                sender: msg.sender,
                text: msg.text,
                timestamp: msg.timestamp,
                fileUrl: buildMediaUrl(msg.url) || null,
                fileName: null,
                fileType: msg.type || 'text',
            }));

            // Paso 2: generar thumbnails para los que lo necesitan
            backendMessages = await Promise.all(
                backendMessages.map((msg) => generateLocalThumbnail(msg))
            );

            // Paso 3 fusionar con los mensajes actuales
            setMessages((prevMessages) => {
                // Filtrar solo mensajes (quitar separadores de fecha)
                const existingMessages = prevMessages.filter((item): item is Message => 'timestamp' in item);

                // Crear mapa único por ID
                const messageMap = new Map<string, Message>();

                for (const msg of [...existingMessages, ...backendMessages]) {
                    messageMap.set(msg.id, msg); // Si hay duplicado, se sobreescribe con el último
                }

                // Convertir a array y ordenar por fecha
                const merged = Array.from(messageMap.values()).sort(
                    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
                );

                // Agregar separadores
                return insertDateSeparators(merged);
            });
        } catch (error) {
            console.error("Error loading messages:", error);
        }
    };    

    // Para insertar separadores con la fecha
    const insertDateSeparators = (messages: Message[]): ChatItem[] => {
        const result: ChatItem[] = [];
        let lastDate = '';

        messages.forEach(msg => {
            const msgDate = dayjs.utc(msg.timestamp).local().format('DD/MM/YYYY');            

            if (msgDate !== lastDate) {
                lastDate = msgDate;
                result.push({
                    type: 'date',
                    id: `date-${msgDate}`,
                    date: msgDate,
                });
            }
            result.push(msg);
        });

        return result;
    };  

    // Utilidad para agregar mensaje al chat (usa separadores si cambia el día)
    const addMessage = (newMessage: Message) => {
        const now = dayjs.utc(newMessage.timestamp).local();
        setMessages(prev => {
            const lastMessage = [...prev].reverse().find(item => 'timestamp' in item) as Message | undefined;
            const lastDate = lastMessage ? dayjs.utc(lastMessage.timestamp).local().format('DD/MM/YYYY') : '';
            const currentDate = now.format('DD/MM/YYYY');

            const newItems: ChatItem[] = [];

            if (lastDate !== currentDate) {
                newItems.push({
                    type: 'date',
                    id: `date-${currentDate}`,
                    date: currentDate,
                });
            }

            newItems.push(newMessage);
            return [...prev, ...newItems];
        });

        setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
        }, 350);
    };

    // Envia mesaje simple solo texto
    const handleSend = async () => {
        const trimmed = inputText.trim();
        if (!trimmed) return;    

        const { sendUrl } = getChatEndpoints();        

        if (!sendUrl) {
            console.error("Missing send URL for current user and recipient roles.");
            return;
        }

        try {
            const res = await fetchWithTimeout(sendUrl, {
                method: 'POST',            
                body: JSON.stringify({ text: trimmed }),
            }, 30000);

            if (!res.ok) {
            console.error("Error sending message", await res.text());
            return;
            }

            const newMsg = await res.json();            

            const newMessage: Message = {
            id: newMsg.id.toString(),
            sender: newMsg.sender,
            text: newMsg.text,
            timestamp: newMsg.timestamp,
            fileUrl: newMsg.url || null,
            fileName: undefined,
            fileType: newMsg.type || "text",
            };

            addMessage(newMessage);
            setInputText('');
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    };

    const onScroll = (event: any) => {
        const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
        const isAtBottom =
            layoutMeasurement.height + contentOffset.y >= contentSize.height - 250;
        setShowScrollButton(!isAtBottom);
    };

    // Botón scroll to end
    const handleScrollToEnd = () => {
        flatListRef.current?.scrollToEnd({ animated: true });
    };

    //Determinar quién es el sender del mensaje
    const isMessageFromCurrentUser = (message: Message): boolean => {
        if (!user?.role) return false;

        // Mapeo explícito: qué valor de "sender" corresponde al usuario actual
        const senderMap: Record<string, string> = {
            student: 'user',
            coach: 'coach',
            admin: 'admin',
        };

        return message.sender === senderMap[user.role];
    };

    const renderItem = ({ item }: { item: ChatItem }) => {
        if ('type' in item && item.type === 'date') {
            return (
                <View style={styles.dateSeparatorContainer}>
                    <Text style={styles.dateSeparatorText}>{item.date}</Text>
                </View>
            );
        }

        const message = item as Message;
        const isUser = isMessageFromCurrentUser(message);
        const displayName = isUser ? user?.username : name;
        const displayAvatar = isUser 
            ? user?.studentProfileImage 
            : avatar;

        return (
            <View
                style={[
                    styles.messageWrapper,
                    isUser ? styles.userWrapper : styles.coachWrapper,
                ]}
            >
                <View
                    style={[
                        styles.nameContainer,
                        isUser ? styles.userName : styles.coachName,
                    ]}
                >
                    <Text style={styles.metaName}>{displayName}</Text>
                </View>

                <View
                    style={[
                        styles.bubbleRow,
                        isUser ? styles.bubbleRowUser : styles.bubbleRowCoach,
                    ]}
                >
                    {!isUser && (
                        <Image source={
                            avatar && avatar.startsWith('http')
                            ? { uri: avatar }
                            : require('../../assets/img/userGeneric.png')
                            } 
                        style={styles.avatar} />
                    )}

                    <View
                        style={[
                            styles.messageBubble,
                            isUser ? styles.userBubble : styles.coachBubble,
                        ]}
                    >
                        <Text
                            style={[
                                styles.messageText,
                                isUser ? styles.userText : styles.coachText,
                            ]}
                        >
                            {message.text}
                        </Text>

                        {/* Mostrar archivo si existe */}
                        {message.fileUrl && (
                            <TouchableOpacity
                                onPress={() => setMediaToView(message)}
                                activeOpacity={0.8}
                                style={{ marginTop: 10 }}
                            >
                                {/* Si es PDF, mostramos placeholder local */}
                                {message.fileType === 'pdf' ? (
                                    <Image
                                        source={require('../../assets/img/pdfIcon.png')}
                                        style={{ width: 150, height: 150, borderRadius: 8 }}
                                        resizeMode="cover"
                                    />
                                ) : message.fileThumbnail ? (
                                    <Image
                                        source={{ uri: message.fileThumbnail }}
                                        style={{ width: 150, height: 150, borderRadius: 8 }}
                                        resizeMode="cover"
                                    />
                                ) : (
                                    <View
                                        style={{
                                            width: 150,
                                            height: 150,
                                            backgroundColor: '#1a1a1a',
                                            borderRadius: 8,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Text style={{ color: '#F7FAFC' }}>{message.fileType?.toUpperCase()}</Text>
                                    </View>
                                )}
                                <Text style={{ color: '#F7FAFC', fontSize: 14, marginTop: 6 }}>
                                    {message.fileName}
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {isUser && (
                        <Image source={
                            displayAvatar && displayAvatar.startsWith('http')
                            ? { uri: displayAvatar }
                            : require('../../assets/img/userGeneric.png')       
                        } 
                        style={styles.avatar} />
                    )}
                </View>
            </View>
        );
    };

    return (
        <ScreenLayout>
            <View style={styles.titleContainer}>
                <Text style={styles.titleText}>{t('account.titles.account')}</Text>
            </View>

            <KeyboardAvoidingView            
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.container}
            >
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.chatContainer}
                    onScroll={onScroll}
                    scrollEventThrottle={16}
                />

                {showScrollButton && (
                    <TouchableOpacity style={styles.scrollButton} onPress={handleScrollToEnd}>
                        <ArrowDownCircle size={36} color="#2B80BE" />
                    </TouchableOpacity>
                )}

                <View style={styles.inputContainer}>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.input}
                            placeholder={t('placeholders.writeMessage')}
                            placeholderTextColor="#aaa"
                            value={inputText}
                            onChangeText={setInputText}
                            onSubmitEditing={handleSend}
                            returnKeyType="send"
                            multiline
                            scrollEnabled
                            textAlignVertical='top'                            
                        />
                        <View style={styles.iconContainer}>
                            <TouchableOpacity onPress={() => {  
                                setInitialAttachmentCaption(inputText);                            
                                setShowAttachmentModal(true)}}>
                                <ImageIcon color="#929292" size={22} />
                            </TouchableOpacity>
                            {/* Ícono de enviar */}
                            <TouchableOpacity
                                onPress={handleSend}
                                style={{ marginLeft: 8 }}
                            >
                                <Send color="#2B80BE" size={26} />                            
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>

            <AttachmentModal
                visible={showAttachmentModal}
                onClose={() => setShowAttachmentModal(false)}
                onSend={async (file, caption) => {
                    setSendingAttachment(true);
                    const { sendUrl } = getChatEndpoints();

                    if (!sendUrl) {
                        console.error("Missing send URL");
                        setSendingAttachment(false);
                        return;
                    }

                    try {
                        // Determinar mimeType y extensión según el tipo del archivo
                        let mimeType = '';
                        let fileName = file.name || `file-${Date.now()}`;

                        switch (file.type) {
                        case 'image':
                        case 'image/jpeg':
                        case 'image/jpg':
                            mimeType = 'image/jpeg';
                            if (!fileName.toLowerCase().endsWith('.jpg') && !fileName.toLowerCase().endsWith('.jpeg')) {
                            fileName += '.jpg';
                            }
                            break;
                        case 'video':
                        case 'video/mp4':
                            mimeType = 'video/mp4';
                            if (!fileName.toLowerCase().endsWith('.mp4')) {
                            fileName += '.mp4';
                            }
                            break;
                        case 'pdf':
                        case 'application/pdf':
                            mimeType = 'application/pdf';
                            if (!fileName.toLowerCase().endsWith('.pdf')) {
                            fileName += '.pdf';
                            }
                            break;
                        default:
                            mimeType = file.type || 'application/octet-stream';
                        }

                        // Construir FormData
                        const formData = new FormData();
                        formData.append('file', {
                        uri: file.uri,
                        name: fileName,
                        type: mimeType,
                        } as any);

                        // Subir archivo
                        const uploadResponse = await fetchWithTimeout(`/api/v1/chat/upload/`, {
                            method: 'POST',
                            body: formData,
                        }, 120000);

                        if (!uploadResponse.ok) {
                        const err = await uploadResponse.text();
                        console.error("Error uploading file:", err);
                        setSendingAttachment(false);
                        return;
                        }

                        const uploaded = await uploadResponse.json(); // { url, type, filename, size }
                        
                        // Enviar mensaje con la info del archivo subida
                        const messagePayload = {
                        type: uploaded.type,
                        text: caption || '',
                        url: uploaded.url,
                        filename: uploaded.filename,
                        size: uploaded.size,
                        };

                        const messageResponse = await fetchWithTimeout(sendUrl, {
                            method: 'POST',
                            body: JSON.stringify(messagePayload),
                        }, 30000);

                        if (!messageResponse.ok) {
                            const err = await messageResponse.text();
                            console.error("Error sending message with file:", err);
                            setSendingAttachment(false);
                        return;
                        }

                        const newMsg = await messageResponse.json();

                        let newMessage: Message = {
                        id: newMsg.id.toString(),
                        sender: newMsg.sender,
                        text: newMsg.text,
                        timestamp: newMsg.timestamp,
                        fileUrl: buildMediaUrl(newMsg.url),
                        fileName: newMsg.filename,
                        fileType: newMsg.type,
                        };  
                        
                        // Generar thumbnail si aplica
                        newMessage = await generateLocalThumbnail(newMessage);                        
                        addMessage(newMessage);
                        setInputText("");
                        setShowAttachmentModal(false);
                        Keyboard.dismiss();
                    } catch (err) {
                        console.error("Attachment message error:", err);
                    } finally {
                        setSendingAttachment(false);
                    }
                    }}

                initialCaption={initialAttachmentCaption}
            />

            {mediaToView && (
                <MediaViewerModal
                    visible={true}
                    onClose={() => setMediaToView(null)}
                    media={{
                        uri: mediaToView.fileUrl!,
                        mediaType: mediaToView.fileType!,
                        name: mediaToView.fileName!,
                    }}
                />
            )}

            {sendingAttachment && (
                <View
                    style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.6)', // semitransparente
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 999, 
                    }}
                >
                    <LottieIcon
                    source={require('../../assets/lottie/loading.json')}
                    size={150} 
                    loop
                    autoPlay
                    />
                </View>
            )}
        </ScreenLayout>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    titleContainer: {
        marginTop: 21,
        marginBottom: 25,
    },
    titleText: {
        fontFamily: 'AnonymousPro-Bold',
        fontWeight: '700',
        fontSize: 22,
        color: '#FFFFFF',
        textAlign: 'center',
    },
    chatContainer: {
        flexGrow: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 16,
        paddingBottom: 10,
        marginBottom: 10,
    },
    messageWrapper: {
        marginBottom: 25,
        width: '100%',
    },
    userWrapper: {
        alignItems: 'flex-start',
    },
    coachWrapper: {
        alignItems: 'flex-end',
    },
    nameContainer: {
        marginBottom: 7,
    },
    metaName: {
        fontFamily: 'AnonymousPro-Regular',
        fontWeight: '400',
        fontSize: 16,
        color: '#D9D9D9',
    },
    userName: {
        alignSelf: 'flex-end',
        marginRight: 60,
    },
    coachName: {
        alignSelf: 'flex-start',
        marginLeft: 60,
    },
    bubbleRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 15,
    },
    bubbleRowUser: {
        justifyContent: 'flex-start',
        marginLeft: 13,
    },
    bubbleRowCoach: {
        justifyContent: 'flex-end',
        marginRight: 13,
    },
    messageBubble: {
        width: "80%",
        minHeight: 45,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    userBubble: {
        backgroundColor: '#2B80BE',
    },
    coachBubble: {
        backgroundColor: '#E8EdF5',
    },
    messageText: {
        fontFamily: 'AnonymousPro-Regular',
        fontWeight: '400',
        fontSize: 16,
        lineHeight: 24,
        textAlign: 'justify',
    },
    userText: {
        color: '#F7FAFC',
    },
    coachText: {
        color: '#0D141C',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    inputContainer: {
        width: '95%',
        marginBottom: 10,
        marginTop: 20,
        alignSelf: 'center',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    input: {
        flex: 1,
        fontFamily: 'AnonymousPro-Regular',
        fontWeight: '400',
        fontSize: 16,
        lineHeight: 24,
        color: '#929292',
        paddingRight: 8,
        minHeight: 40,
        maxHeight: 120
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconButton: {
        padding: 4,
    },
    scrollButton: {
        position: 'absolute',
        bottom: 90,
        right: 20,
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 4,
        elevation: 5,
    },
    dateSeparatorContainer: {
        alignSelf: 'center',
        backgroundColor: '#D9D9D9',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 6,
        marginVertical: 12,
    },
    dateSeparatorText: {
        fontFamily: 'AnonymousPro-Regular',
        fontSize: 16,
        color: '#0D141C',
    }
});