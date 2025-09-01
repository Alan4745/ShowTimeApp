import { View, Text, TouchableOpacity, StyleSheet, TextInput, Image } from 'react-native';
import React, {useState, useRef, useEffect} from 'react';
import { useTranslation } from 'react-i18next';
import ScreenLayout from '../components/common/ScreenLayout';
import {Globe, ChevronDown, FileVideo, Image as ImageIcon, FileText} from 'lucide-react-native';
import DropdownModal from '../components/modals/DropdownModal';
import { launchImageLibrary } from 'react-native-image-picker';
import { createThumbnail } from 'react-native-create-thumbnail';
import MediaGrid from '../components/common/MediaGrid';
import { pick, types } from '@react-native-documents/picker';
import { errorCodes, isErrorWithCode } from '@react-native-documents/picker';
import PopupConfirm from '../components/modals/PopupConfirm';
import PopupAlert from '../components/modals/PopupAlert';
import LottieIcon from '../components/common/LottieIcon';
import userData from '../data/user.json';
import categoriesByUserType, {UserType}  from '../data/categoriesByUser';
import { Keyboard } from 'react-native';


type MediaItem = {
  id: string;
  type: 'image' | 'video' | 'pdf';
  uri: string;
  thumbnail?: string;
};

export default function PublishPostScreen() {
    const { t } = useTranslation();     
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [dropdownVisible, setDropdownVisible] = useState(false);  
    const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
    const [confirmVisible, setConfirmVisible] = useState(false);
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [mediaToDelete, setMediaToDelete] = useState<MediaItem | null>(null);
    const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
    const [postSuccess, setPostSuccess]= useState(false);
    const [isGeneratingThumbnail, setIsGeneratingThumbnail] = useState(false); 
    const [darwinMainCategory, setDarwinMainCategory] = useState<string | null>(null);
    const [darwinSubcategories, setDarwinSubcategories] = useState<string[]>([]);
    const userType = userData.userType as UserType;
    const isDarwin = userType === 'Darwin';
    const categories = isDarwin? Object.keys(categoriesByUserType.Darwin) : categoriesByUserType[userType] ?? categoriesByUserType['Student'];

    

    //Sección para manejar el Post
    const [postContent, setPostContent] = useState('');    

    const handlePressPost = () => {
        const hasText = postContent.trim().length > 0;
        const hasMedia = mediaItems.length > 0;

        if (!hasText && !hasMedia) {
            setAlertMessage(t('publishPost.alerts.emptyPost'));
            setAlertVisible(true);
            return;
        }

        // Mostrar pop-up de confirmación
        setConfirmVisible(true);
    };

    const confirmPost = () => {
        const newPost = {
            id: Date.now(),
            username: userData.username,
            userType: userData.userType,
            text: postContent,
            category: selectedCategory ?? "",
            createdAt: new Date().toISOString(),
            media: mediaItems.map(({ id, ...item }) => item),
            commentsCount: 0,
            likesCount: 0,
        };

        // json para enviar a API
        console.log('Nuevo JSON de Post:', JSON.stringify(newPost, null, 2));

        // Reset UI        
        setPostContent('');
        setSelectedCategory(null);        
        setMediaItems([]);
        setConfirmVisible(false); 
        
        setPostSuccess(true);
        setTimeout(() => setPostSuccess(false), 2500); // Se oculta después de 2.5 segundos

    };          

    // Selección de Categoria
    const handleCategorySelect = (categoryKey: string) => {
        if (isDarwin) {
            // Seleccionó un main category, mostrar segundo modal con subcategorías
            setDarwinMainCategory(categoryKey);
            const subs = (categoriesByUserType.Darwin as Record<string, string[]>)[categoryKey];
            setDarwinSubcategories(subs);
        } else {
            setSelectedCategory(categoryKey);
            setDropdownVisible(false);
        }
        };

        const handleDarwinSubcategorySelect = (subcategoryKey: string) => {
        setSelectedCategory(`${darwinMainCategory}:${subcategoryKey}`);
        setDarwinMainCategory(null);
        setDropdownVisible(false);
    };

    
    // Selección de video desde galeria       
    const handleVideoSelect = () => {
        Keyboard.dismiss();
        const options = {
            mediaType: 'video' as const,
            videoQuality: 'high' as const,
            selectionLimit: 1,
        };

        launchImageLibrary(options, async (response) => {
            if (response.didCancel || !response.assets || response.assets.length === 0) return;

            const video = response.assets[0];
            // inicia animación de loading
            setIsGeneratingThumbnail(true);
            const start = Date.now();
            try {
            const thumbnail = await createThumbnail({ url: video.uri! });

            const newVideo: MediaItem = {
                id: `${Date.now()}`,
                type: 'video',
                uri: video.uri!,
                thumbnail: thumbnail.path,
            };

            setMediaItems(prev => [...prev, newVideo]);
            } catch (err) {
                setAlertMessage(t('publishPost.alerts.thumbnailError'));
                setAlertVisible(true);
            } finally {
                // Asegura un mínimo de 2.5 segundos de animación loading
                const elapsed = Date.now() - start;
                const delay = Math.max(2000 - elapsed, 0);
                setTimeout(() => setIsGeneratingThumbnail(false), delay);
            }
        });
    };    

    // Selección de imagenes desde la galería
    const handleImageSelect = () => {
        Keyboard.dismiss();
        const options = {
            mediaType: 'photo' as const,
            selectionLimit: 0, // 0 = múltiples
        };

        launchImageLibrary(options, (response) => {
            if (response.didCancel || !response.assets) return;

            const images: MediaItem[] = response.assets.map((asset, index) => ({
            id: `${Date.now()}-${index}`,
            type: 'image',
            uri: asset.uri!,
            }));

            setMediaItems(prev => [...prev, ...images]);
        });
    };

    // Selección de pdf desde la galeria
    const handlePDFSelect = async () => {
        Keyboard.dismiss();
        try {
            const [res] = await pick({
            type: [types.pdf],
            });

            const pdfItem: MediaItem = {
            id: `${Date.now()}`,
            type: 'pdf',
            uri: res.uri,
            thumbnail: Image.resolveAssetSource(require('../../assets/img/Adobe.png')).uri,};
            

            setMediaItems(prev => [...prev, pdfItem]);
        } catch (err) {
            if (isErrorWithCode(err)) {
                if (err.code === errorCodes.OPERATION_CANCELED) {
                    // El usuario canceló; no mostramos error                    
                } else {
                setAlertMessage(t('publishPost.alerts.pdfError'));
                setAlertVisible(true);
                }
            } else {
                setAlertMessage(t('publishPost.alerts.pdfError'));
                setAlertVisible(true);                
            }
        }
    };

    // Función para eliminar media del post
    const confirmDeleteMedia = () => {
        if (mediaToDelete) {
            setMediaItems(prev => prev.filter(m => m.id !== mediaToDelete.id));
        }
        setDeleteConfirmVisible(false);
        setMediaToDelete(null);
    };
    
    

  return (
    <ScreenLayout>
        {/* "Post" button */}
        <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.postButton} onPress={handlePressPost}>
                <Text style={styles.postButtonText}>{t('publishPost.buttons.post')}</Text>
            </TouchableOpacity>
        </View>

        {/* Post text message input */}
        <TextInput            
            style={styles.textInput}
            placeholder={t('publishPost.placeholders.textInput')}
            placeholderTextColor="#929292"
            multiline
            value={postContent} 
            onChangeText={setPostContent}
        />

        {/* Category selector */}
        <View style={styles.categorySelectorContainer}>
            <Globe size={20} color="#FFFFFF"/>

            <TouchableOpacity
            style={styles.categorySelector}
            onPress={() => setDropdownVisible(true)}
            >
            <Text style={[styles.categoryText, !selectedCategory && styles.categoryPlaceholderText]}>
                {selectedCategory
                    ? isDarwin
                    ? t(`publishPost.categories.${selectedCategory.split(':')[1]}`)  // solo subcategoría
                    : t(`publishPost.categories.${selectedCategory}`)
                    : t('publishPost.placeholders.category')}
            </Text>

            <ChevronDown size={18} color="#fff" />
            </TouchableOpacity>
        </View>

        {/* File Buttons */}
        <View style={styles.fileButtonsContainer}>
            <TouchableOpacity style={styles.fileButton} onPress={handleVideoSelect}>
                <FileVideo size={18} color="#FFFFFF" />                
                <Text style={styles.fileButtonText}>{t('publishPost.buttons.video')}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.fileButton} onPress={handleImageSelect}>
                <ImageIcon size={18} color="#FFFFFF" />                
                <Text style={styles.fileButtonText}>{t('publishPost.buttons.image')}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.fileButton}  onPress={handlePDFSelect}>
                <FileText size={18} color="#FFFFFF" />
                <Text style={styles.fileButtonText}>{t('publishPost.buttons.text')}</Text>
            </TouchableOpacity>
        </View>

        {/* Thumbnails */}
        {mediaItems.length === 0 ? (
            <View style={styles.emptyGridContainer}>
                <LottieIcon
                source={require('../../assets/lottie/No-Data.json')}
                size={200}
                loop
                />
                <Text style={styles.emptyGridText}>
                {t('publishPost.emptyState')}
                </Text>
            </View>
            ) : (
            <MediaGrid
                media={mediaItems}
                onMediaPress={(item: MediaItem) => {
                setMediaToDelete(item);
                setDeleteConfirmVisible(true);    
                }}
            />
        )}

        {/* <MediaGrid
            media={mediaItems}
            onMediaPress={(item: MediaItem) => {
                setMediaToDelete(item);
                setDeleteConfirmVisible(true);    
            }}
        />*/}

        {/* Modal para Main Category */}
        <DropdownModal
            visible={dropdownVisible && !darwinMainCategory}
            onClose={() => {
                setDropdownVisible(false);
                setDarwinMainCategory(null);
            }}
            title={t("modalTitles.selectCategory")}
            items={categories}
            onSelect={handleCategorySelect}
            renderItem={(item) => t(`publishPost.categories.${item}`)}
        />

        {/* Modal para Subcategorías Darwin */}
        {isDarwin && darwinMainCategory && (
            <DropdownModal
                visible={true}
                onClose={() => {
                setDarwinMainCategory(null);
                setDropdownVisible(false);
                }}
                title={t(`publishPost.categories.${darwinMainCategory}`)}
                items={darwinSubcategories}
                onSelect={handleDarwinSubcategorySelect}
                renderItem={(item) => t(`publishPost.categories.${item}`)}
            />
        )}


        {/* Post confirmation */}    
        <PopupConfirm
            visible={confirmVisible}
            title={t('publishPost.alertPost.title')}
            message={t('publishPost.alertPost.message')}
            confirmText={t('modalTitles.buttonOptions.confirm')}
            cancelText={t('modalTitles.buttonOptions.cancel')}
            onConfirm={confirmPost}
            onCancel={() => setConfirmVisible(false)}
        />       

        {/* Remove media confirmation */}    
        <PopupConfirm
            visible={deleteConfirmVisible}
            title={t('publishPost.removeAlert.title')}
            message={t('publishPost.removeAlert.message')}
            confirmText={t('publishPost.removeAlert.optionRemove')}
            cancelText={t('publishPost.removeAlert.optionCancel')}
            onConfirm={confirmDeleteMedia}
            onCancel={() => setDeleteConfirmVisible(false)}
        />

        {/* Handles error alerts */}    
        <PopupAlert
            visible={alertVisible}
            message={alertMessage}
            onClose={() => setAlertVisible(false)}
        />

        {postSuccess && (
            <View style={styles.successAnimationContainer}>
                <LottieIcon
                source={require('../../assets/lottie/Success.json')}
                size={150}
                loop={false}
                />
            </View>
        )}

        {isGeneratingThumbnail && (
        <View style={styles.loadingOverlay}>
            <LottieIcon
                source={require('../../assets/lottie/loading.json')}
                size={100}
                loop
            />
                <Text style={styles.loadingText}>
                {t('publishPost.loading')}
            </Text>
        </View>
        )}

        
    </ScreenLayout>    
  )
}

const styles = StyleSheet.create({ 
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 28,        
    },   
    postButton:{
        backgroundColor: "#2B80BE",
        width: 107,
        height: 31,
        borderRadius: 124,        
        alignItems: "center",
        justifyContent: "center",
        marginRight: 15,
    },
    postButtonText:{
        fontFamily: 'AnonymousPro-Regular',
        fontWeight: '700',
        fontSize: 15,
        color: "#FFFFFF",
    }, 
    textInput:{
        width: '100%',
        maxWidth: 480,         
        height: 216,                   
        padding: 20,
        fontFamily: 'AnonymousPro-Regular',
        fontSize: 16,
        fontWeight: "400",
        lineHeight: 24,
        textAlignVertical: 'top', 
        marginTop: 30, 
        color: "#FFFFFF"   
    },    
    categorySelectorContainer: {
        flexDirection: 'row',
        alignItems: 'center', 
        gap: 30,        
        marginTop: 25,
        marginBottom: 10,
        paddingHorizontal: 20,        
    },
    categorySelector: {
        flexDirection: 'row',
        alignItems: 'center',          
        paddingVertical: 10,
        paddingHorizontal: 15,
        flex: 1,
        justifyContent: 'space-between',
        borderColor: "#ADADAD",
        borderWidth: 1,
        borderRadius: 12,
    },
    categoryPlaceholderText: {
        fontFamily: 'AnonymousPro-Regular',
        fontSize: 16,
        fontWeight: "400",
        color: '#737373', 
    },
    categoryText: {
        fontFamily: 'AnonymousPro-Regular',
        fontSize: 16,
        fontWeight: "400",
        color: '#FFFFFF',        
    },    
    fileButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    fileButton: {
        flexDirection: 'row',
        alignItems: 'center',
        minWidth: 125,
        borderWidth: 1,
        borderColor: '#929292',
        borderRadius: 12,
        paddingVertical: 8,
        paddingHorizontal: 15,
        gap: 6,
    },
    fileButtonText: {
        fontFamily: 'AnonymousPro-Regular',
        fontWeight: "400",
        fontSize: 14,
        color: '#FFFFFF',
    },
    lottieIcon:{
        height: 18,
        aspectRatio: 1,                       
    },
    successAnimationContainer: {
        position: 'absolute',
        top: '40%',
        left: '25%',
        width: '50%',
        zIndex: 999,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyGridContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 40,
    },
        emptyGridText: {
        fontSize: 16,
        color: '#FFFFFF',        
        fontFamily: 'AnonymousPro-Regular',
    },

    loadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 999,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        alignItems: 'center',
        justifyContent: 'center',
    },

        loadingText: {
        marginTop: 20,
        color: '#FFFFFF',
        fontSize: 16,
        fontFamily: 'AnonymousPro-Regular',
    },
    
})