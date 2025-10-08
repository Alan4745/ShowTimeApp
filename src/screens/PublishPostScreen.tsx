import { View, Text, TouchableOpacity, StyleSheet, TextInput, Image, Keyboard } from 'react-native';
import React, {useState} from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
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
import categoriesByUserType, {UserType}  from '../data/categoriesByUser';
import { useAuth } from '../context/AuthContext';
import API_BASE_URL from '../config/api';


type MediaItem = {
  id: string;
  mediaType: 'image' | 'video' | 'pdf';
  uri: string;
  thumbnail?: string;   
  title?: string;
  author?: string;
  description?: string;
  subcategory?: string;
  format?: string;
  likes?: number;
  comments?: number;
};

export default function PublishPostScreen() {
    const { t } = useTranslation();  
    const navigation = useNavigation();   
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
    const [isLoading, setIsLoading] = useState(false);
    const { token, user } = useAuth();
    const userType = user?.role as UserType;
    const isDarwin = userType === 'darwin';
    const categories = isDarwin? Object.keys(categoriesByUserType.darwin) : categoriesByUserType[userType] ?? categoriesByUserType['student'];       
    const endpoint = `${API_BASE_URL}/api/posts/`;

    //Sección para manejar el Post
    const [postContent, setPostContent] = useState('');    

    const handlePressPost = () => {
        const hasText = postContent.trim().length > 0;
        const hasMedia = mediaItems.length > 0;
        Keyboard.dismiss();

        if (!hasText && !hasMedia) {
            setAlertMessage(t('publishPost.alerts.emptyPost'));
            setAlertVisible(true);
            return;
        }

        // Mostrar pop-up de confirmación
        setConfirmVisible(true);
    };

    const confirmPost = async () => {
        setConfirmVisible(false);
        
        try {            
            setIsLoading(true);

            const formData = new FormData();            
            // Texto del post
            formData.append('text', postContent);

            // Categoría si quieres incluirla (añádelo si tu backend lo maneja)
            if (selectedCategory) {
                formData.append('category', selectedCategory);
            }

            // Archivos multimedia
            mediaItems.forEach((item, index) => {
                let mimeType = '';
                let fileName = `upload_${Date.now()}_${index}`;
                
                // Detecta tipo y nombre de archivo
                switch (item.mediaType) {
                    case 'video':
                    mimeType = 'video/mp4';
                    fileName += '.mp4';
                    break;
                    case 'image':
                    mimeType = 'image/jpeg';
                    fileName += '.jpg';
                    break;
                    case 'pdf':
                    mimeType = 'application/pdf';
                    fileName += '.pdf';
                    break;
                    default:
                    mimeType = 'application/octet-stream';
                }
                
                // Usa uri tal como viene
                formData.append('media', {
                    uri: item.uri,
                    type: mimeType,
                    name: item.title || fileName,
                } as any);

                // Adjunta thumbnail si es video
                if (item.mediaType === 'video' && item.thumbnail) {
                    const thumbExt = 'jpg'; 
                    const thumbName = `thumb_${Date.now()}_${index}.${thumbExt}`;         

                    formData.append('thumbnails', {
                    uri: item.thumbnail,
                    type: 'image/jpg',
                    name: thumbName,
                    } as any);
                }               

            });               

            const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Token ${token}`,
                // NO pongas 'Content-Type', fetch lo gestiona solo para FormData
            },
            body: formData,
            });

            if (!response.ok) {
                const contentType = response.headers.get("content-type");

                if (contentType && contentType.includes("application/json")) {
                    const errorData = await response.json();
                    console.error("Error al publicar post:", errorData);
                } else {
                    const errorText = await response.text(); // podría ser HTML
                    console.error("Error inesperado al publicar post:", errorText);
                }

                setAlertMessage(t('publishPost.alerts.serverError'));
                setAlertVisible(true);
                return;
            }

            // Éxito: limpiar formulario
            setPostContent('');
            setSelectedCategory(null);
            setMediaItems([]);  
            setIsLoading(false);          
            setPostSuccess(true);

            setTimeout(() => {                
                setPostSuccess(false);
                (navigation as any).navigate("Home")}, 2500);

        } catch (error) {
            console.error("Error de red al publicar:", error);
            setAlertMessage(t('publishPost.alerts.networkError'));
            setAlertVisible(true);
        } finally {
            if (isLoading) setIsLoading(false);                
        }
    };
          

    // Selección de Categoria
    const handleCategorySelect = (categoryKey: string) => {
        if (isDarwin) {
            // Seleccionó un main category, mostrar segundo modal con subcategorías
            setDarwinMainCategory(categoryKey);
            const subs = (categoriesByUserType.darwin as Record<string, string[]>)[categoryKey];
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
            try {
            const thumbnail = await createThumbnail({ url: video.uri! });

            const newVideo: MediaItem = {
                id: `${Date.now()}`,
                mediaType: 'video',
                uri: video.uri!,
                thumbnail: thumbnail.path,
            };

            setMediaItems(prev => [...prev, newVideo]);
            } catch (err) {
                setAlertMessage(t('publishPost.alerts.thumbnailError'));
                setAlertVisible(true);
            } finally {
                setIsGeneratingThumbnail(false);
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

            // inicia animación de loading
            setIsGeneratingThumbnail(true);            

            const images: MediaItem[] = response.assets.map((asset, index) => ({
            id: `${Date.now()}-${index}`,
            mediaType: 'image',
            uri: asset.uri!,
            }));

            setMediaItems(prev => [...prev, ...images]);           
            setIsGeneratingThumbnail(false);
        });
    };

    // Selección de pdf desde la galeria
    const handlePDFSelect = async () => {
        Keyboard.dismiss();

        try {
            const [res] = await pick({ type: [types.pdf] });

            if (!res) throw new Error("No PDF selected");

            // Empieza el loading al volver del picker
            setIsGeneratingThumbnail(true);            

            const pdfItem: MediaItem = {
                id: `${Date.now()}`,
                mediaType: 'pdf',
                uri: res.uri,
                thumbnail: Image.resolveAssetSource(require('../../assets/img/Adobe.png')).uri,
            };

            setMediaItems(prev => [...prev, pdfItem]);
            setIsGeneratingThumbnail(false);
            

        } catch (err) {
            if (isErrorWithCode(err)) {
                if (err.code !== errorCodes.OPERATION_CANCELED) {
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
                media={mediaItems.map(item => ({
                    ...item,
                    thumbnailUrl: item.thumbnail,    
                }))}
                onMediaPress={(item: MediaItem) => {
                setMediaToDelete(item);
                setDeleteConfirmVisible(true);    
                }}
            />
        )}       

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

        {isGeneratingThumbnail || isLoading && (
        <View style={styles.loadingOverlay}>
            <LottieIcon
                source={require('../../assets/lottie/loading.json')}
                size={100}
                loop
            />
                <Text style={styles.loadingText}>
                {isGeneratingThumbnail ? t('publishPost.loading') : t('publishPost.sending')}
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
        flexWrap:"nowrap",
        justifyContent: 'space-around',
        marginTop: 20,
        marginBottom: 20,
        
    },
    fileButton: {
        flexDirection: 'row',
        alignItems: 'center',
        maxWidth: 120,
        borderWidth: 1,
        borderColor: '#929292',
        borderRadius: 12,
        paddingVertical: 8,
        paddingHorizontal: 10,
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
        flex: 1,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 999,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#000000" 
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
        //backgroundColor: 'rgba(0, 0, 0, 0.7)',
        backgroundColor: "#000000",
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