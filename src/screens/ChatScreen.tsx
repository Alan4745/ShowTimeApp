import {View, Text, StyleSheet, TextInput, FlatList, Image, KeyboardAvoidingView, Platform,
  TouchableOpacity, Keyboard} from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Image as ImageIcon, ArrowDownCircle, Key } from 'lucide-react-native';
import ScreenLayout from '../components/common/ScreenLayout';
import AttachmentModal from '../components/modals/AttachmentModal';
import MediaViewerModal from '../components/modals/MediaViewerModal';
import dayjs from 'dayjs';
import userData from '../data/user.json';
import initialMessages from '../data/chat.json';

type Message = {
    id: string;
    sender: 'user' | 'coach';
    text: string;
    timestamp: string;
    fileUrl?: string;
    fileName?: string;
    fileType?: 'image' | 'video' | 'pdf';
    fileThumbnail?: string;
};

type DateSeparator = {
    type: 'date';
    id: string;
    date: string;
};

type ChatItem = Message | DateSeparator;

type ChatScreenRouteProp = RouteProp<
    { Chat: { name: string; avatar: string } },
    'Chat'
>;

export default function ChatScreen() {
    const route = useRoute<ChatScreenRouteProp>();
    const { t } = useTranslation();
    const { name, avatar } = route.params;
    const [inputText, setInputText] = useState('');
    const [showScrollButton, setShowScrollButton] = useState(false);
    const [showAttachmentModal, setShowAttachmentModal] = useState(false);
    const [mediaToView, setMediaToView] = useState<null | Message>(null);
    const [initialAttachmentCaption, setInitialAttachmentCaption] = useState("");
    const flatListRef = useRef<FlatList>(null);

    // Para insertar separadores con la fecha
    const insertDateSeparators = (messages: Message[]): ChatItem[] => {
        const result: ChatItem[] = [];
        let lastDate = '';

        messages.forEach(msg => {
            const msgDate = dayjs(msg.timestamp).format('DD/MM/YYYY');
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

    const [messages, setMessages] = useState<ChatItem[]>(
        insertDateSeparators(initialMessages as Message[])
    );

    // Scroll hasta el final
    useEffect(() => {
        const timeout = setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: false });
        }, 100);
        return () => clearTimeout(timeout);
    }, []);

    // Utilidad para agregar mensaje al chat (usa separadores si cambia el día)
    const addMessage = (newMessage: Message) => {
        const now = dayjs(newMessage.timestamp);
        setMessages(prev => {
            const lastMessage = [...prev].reverse().find(item => 'timestamp' in item) as Message | undefined;
            const lastDate = lastMessage ? dayjs(lastMessage.timestamp).format('DD/MM/YYYY') : '';
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
    const handleSend = () => {
        if (!inputText.trim()) return;

        const now = dayjs();
        const newMessage: Message = {
            id: Date.now().toString(),
            sender: 'user',
            text: inputText.trim(),
            timestamp: now.toISOString(),
        };

        addMessage(newMessage);
        setInputText('');
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

    const renderItem = ({ item }: { item: ChatItem }) => {
        if ('type' in item && item.type === 'date') {
            return (
                <View style={styles.dateSeparatorContainer}>
                    <Text style={styles.dateSeparatorText}>{item.date}</Text>
                </View>
            );
        }

        const message = item as Message;
        const isUser = message.sender === 'user';
        const displayName = isUser ? userData.username : name;
        const displayAvatar = isUser ? userData.avatar : avatar;

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
                        <Image source={{ uri: displayAvatar }} style={styles.avatar} />
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
                                {message.fileThumbnail ? (
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
                        <Image source={{ uri: displayAvatar }} style={styles.avatar} />
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
                        />
                        <TouchableOpacity onPress={() => {  
                            setInitialAttachmentCaption(inputText);                            
                            setShowAttachmentModal(true)}}>
                            <ImageIcon color="#929292" size={22} />
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>

            <AttachmentModal
                visible={showAttachmentModal}
                onClose={() => setShowAttachmentModal(false)}
                onSend={(file, caption) => {
                    const now = dayjs();
                    const newMessage: Message = {
                        id: Date.now().toString(),
                        sender: 'user',
                        text: caption || '',
                        timestamp: now.toISOString(),
                        fileUrl: file.uri,
                        fileName: file.name,
                        fileType: file.type || "image",
                        fileThumbnail: file.thumbnail || file.uri,
                    };

                    addMessage(newMessage);
                    setShowAttachmentModal(false);
                    setInputText("");
                    Keyboard.dismiss();
                }}
                initialCaption={initialAttachmentCaption}
            />

            {mediaToView && (
                <MediaViewerModal
                    visible={true}
                    onClose={() => setMediaToView(null)}
                    media={{
                        uri: mediaToView.fileUrl!,
                        type: mediaToView.fileType!,
                        name: mediaToView.fileName!,
                    }}
                />
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
        width: 350,
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