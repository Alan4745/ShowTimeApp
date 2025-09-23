import React, {useState} from 'react'
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image} from 'react-native'
import { useTranslation } from 'react-i18next';
import {ChevronDown, FileVideo, Image as ImageIcon, FileText} from 'lucide-react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { pick, types } from '@react-native-documents/picker';
import { errorCodes, isErrorWithCode } from '@react-native-documents/picker';
import { createThumbnail } from 'react-native-create-thumbnail';
import { Keyboard } from 'react-native';
import ScreenLayout from '../components/common/ScreenLayout'
import DropdownModal from '../components/modals/DropdownModal';
import categoriesByUserType from '../data/categoriesByUser';

type MediaItem = {
  id: string;
  type: 'image' | 'video' | 'pdf';
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

export default function UploadContentScreen() {
    const {t} = useTranslation();
    const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertVisible, setAlertVisible] = useState(false);
    const darwinCategories = categoriesByUserType.darwin;
    const [mainCategory, setMainCategory] = useState<string | null>(null);
    const [subCategory, setSubCategory] = useState<string | null>(null);
    const [isMainCategoryModalVisible, setMainCategoryModalVisible] = useState(false);
    const [isSubCategoryModalVisible, setSubCategoryModalVisible] = useState(false);


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
            try {
            const thumbnail = await createThumbnail({ url: video.uri! });

            const newVideo: MediaItem = {
                id: `${Date.now()}`,
                type: 'video',
                uri: video.uri!,
                thumbnail: thumbnail.path,
            };

            setMediaItems([newVideo]);

            } catch (err) {
                setAlertMessage(t('publishPost.alerts.thumbnailError'));
                setAlertVisible(true); 
            }               
        });
    };

    // Selección de imagen desde la galería
    const handleImageSelect = () => {
        Keyboard.dismiss();

        const options = {
            mediaType: 'photo' as const,
            selectionLimit: 1,
        };

        launchImageLibrary(options, (response) => {
            if (response.didCancel || !response.assets || response.assets.length === 0) return;

            const image = response.assets[0];

            const newImage: MediaItem = {
            id: `${Date.now()}`,
            type: 'image',
            uri: image.uri!,
            };

            // Reemplaza el contenido actual
            setMediaItems([newImage]);
        });
    };

    // Selección de pdf desde la galeria
    const handlePDFSelect = async () => {
        Keyboard.dismiss();

        try {
            const [res] = await pick({ type: [types.pdf] });

            if (!res) throw new Error("No PDF selected");

            const pdfItem: MediaItem = {
            id: `${Date.now()}`,
            type: 'pdf',
            uri: res.uri,
            thumbnail: Image.resolveAssetSource(require('../../assets/img/Adobe.png')).uri, // thumbnail estático
            };

            setMediaItems([pdfItem]); //Reemplaza el contenido actual

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

    const currentMedia = mediaItems[0];
    return (
        <ScreenLayout>
            {/* HEADER */}
            <View style = {styles.pageTitleContainer}>
                <Text style = {styles.titleText}>{t('account.titles.uploadContent')}</Text>
            </View>

            {/* THUMBNAIL */}
            <Text style = {styles.thumbnailText}>Thumbnail</Text>
            <View style = {styles.imageContainer}>
                {currentMedia? (
                    <Image
                    source={{ uri: currentMedia.thumbnail || currentMedia.uri }}
                    style={[
                        styles.thumbnailImage,
                        currentMedia.type === 'pdf' && styles.pdfThumbnailImage,
                    ]}
                    resizeMode={currentMedia.type === 'pdf' ? 'contain' : 'cover'}
                    />
                ) : (
                    <Text style={{ color: "gray", alignSelf: "center"}}>{t('account.titles.noThumbnail')}</Text>
                )}
            </View>
            

            {/* TITLE AND DESCRIPTION INPUT */}
            <View style = {styles.inputContainer}>
                <View style = {styles.titleInputContainer}>
                    <TextInput
                        style={[styles.titleInput]}
                        placeholder={t('account.placeholders.inputTitle')}
                        placeholderTextColor="#929292"
                        
                    />
                </View>   
                <View style = {styles.descriptionInputContainer}>
                    <TextInput
                        multiline
                        style={[styles.descriptionInput]}
                        placeholder={t('account.placeholders.inputDescription')}
                        placeholderTextColor="#929292"
                        
                    />
                </View>   
            </View> 

            {/* File Buttons */}
            <Text style = {styles.fileFormatText}>{t('account.titles.fileFormat')}</Text>
            <View style={styles.fileButtonsContainer}>
                <TouchableOpacity style={styles.fileButton} onPress={handleVideoSelect}>
                    <FileVideo size={18} color="#FFFFFF" />                
                    <Text style={styles.fileButtonText}>{t('publishPost.buttons.video')}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.fileButton} onPress={handleImageSelect}>
                    <ImageIcon size={18} color="#FFFFFF" />                
                    <Text style={styles.fileButtonText}>{t('publishPost.buttons.image')}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.fileButton} onPress={handlePDFSelect}>
                    <FileText size={18} color="#FFFFFF" />
                    <Text style={styles.fileButtonText}>{t('publishPost.buttons.text')}</Text>
                </TouchableOpacity>
            </View>   

            {/* Category Select */}
            <Text style={styles.categoryTitleText}>{t('account.titles.category')}</Text>
            <View style={styles.categoryContainer}>
                {/* MAIN CATEGORY BUTTON */}
                <TouchableOpacity
                    style={styles.categorySelector}
                    onPress={() => setMainCategoryModalVisible(true)}
                >
                    <Text style={styles.categoryText}>
                        {mainCategory || t('account.placeholders.mainCategory')}
                    </Text>
                    <ChevronDown size={18} color="#fff" />
                </TouchableOpacity>

                {/* SUBCATEGORY BUTTON */}
                <TouchableOpacity
                    style={[
                        styles.categorySelector,
                        !mainCategory && { opacity: 0.5 }, // Visual hint for disabled
                    ]}
                    onPress={() => {
                        if (mainCategory) setSubCategoryModalVisible(true);
                    }}
                    disabled={!mainCategory}
                >
                    <Text style={styles.categoryText}>
                        {subCategory || t('account.placeholders.subcategory')}
                    </Text>
                    <ChevronDown size={18} color="#fff" />
                </TouchableOpacity>
            </View>

            {/* Footer */}
            <View style = {styles.footer}>
                <TouchableOpacity style={styles.uploadButton} >
                    <Text style={styles.uploadButtonText}>{t('account.buttons.uploadContent')}</Text>
                </TouchableOpacity>
                <Text style = {styles.helperText}>{t('helperTexts.uploadHelperText1')}</Text>
                <Text style = {styles.helperText}>{t('helperTexts.uploadHelperText2')}</Text>
            </View>

            {/* MAIN CATEGORY MODAL */}
            <DropdownModal
                visible={isMainCategoryModalVisible}
                onClose={() => setMainCategoryModalVisible(false)}
                title={t('account.titles.selectMainCategory')}
                items={Object.keys(darwinCategories)}
                onSelect={(selectedCategory) => {
                    setMainCategory(selectedCategory);
                    setSubCategory(null); // Reset subcategory when main changes
                    setMainCategoryModalVisible(false);
                }}
                renderItem={(item) => t(`publishPost.categories.${item}`)}
            />

            {/* SUBCATEGORY MODAL */}
            <DropdownModal
                visible={isSubCategoryModalVisible}
                onClose={() => setSubCategoryModalVisible(false)}
                title={t('account.titles.selectSubcategory')}
                items={mainCategory ? (darwinCategories as any)[mainCategory] : []}
                onSelect={(selectedSubCategory) => {
                    setSubCategory(selectedSubCategory);
                    setSubCategoryModalVisible(false);
                }}
                renderItem={(item) => t(`publishPost.categories.${item}`)}
            />
        </ScreenLayout>
    )
}

const styles = StyleSheet.create({
    pageTitleContainer:{
        marginTop: 25,
        alignSelf: "center"
    },
    titleText:{
        fontFamily: "AnonymousPro-Bold",
        fontWeight: "700",
        fontSize: 22,
        color: "#FFFFFF"
    },
    thumbnailText: {
        fontFamily: "AnonymousPro-Bold",
        fontWeight: "700",
        fontSize: 18,
        color: "#FFFFFF",
        marginTop: 25,
        marginLeft: 10
    },
    imageContainer:{
        width: "95%",
        height: "20%",        
        alignSelf: "center",
        borderRadius: 10,
        marginTop: 10        
    },
    thumbnailImage: {
        width: '100%',
        height: '100%',       
    },
    pdfThumbnailImage: {
        width: "100%",
        height: "100%",
        alignSelf: 'center',
    }, 
    inputContainer:{
        flexDirection: "column",
        width: "95%",
        alignSelf: "center",
        marginTop: 20,
        gap: 15
    },   
    titleInputContainer: {
        height: 55,
        borderWidth: 1,
        borderColor:"#FFFFFF",   
        borderRadius: 10,
        paddingHorizontal: 10,
        justifyContent: "center"
    }, 
    titleInput: {
        fontFamily: "AnonymousPro-Regular",
        fontWeight: "400",
        fontSize: 16,
        color: "#929292",        
    },
    descriptionInputContainer:{
        height: 135,
        borderWidth: 1,
        borderColor:"#FFFFFF",   
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 10
    },
    descriptionInput: {
        fontFamily: "AnonymousPro-Regular",
        fontWeight: "400",
        fontSize: 16,
        color: "#929292", 
        textAlign: "justify"   
    },
    fileFormatText: {
        fontFamily: "AnonymousPro-Bold",
        fontWeight: "700",
        fontSize: 18,
        color: "#FFFFFF",
        marginTop: 15,
        marginLeft: 10
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
    categoryTitleText: {
        fontFamily: "AnonymousPro-Bold",
        fontWeight: "700",
        fontSize: 18,
        color: "#FFFFFF",
        marginTop: 5,
        marginLeft: 10
    },
    categoryContainer:{
        flexDirection: "column",
        gap: 10,
        alignItems: "center"
    },
    categorySelector: {
        flexDirection: 'row',
        width:"95%",
        height: 45,
        justifyContent: 'space-between',
        borderColor: "#ADADAD",
        borderWidth: 1,
        borderRadius: 10,        
        paddingHorizontal: 15,        
        alignItems: 'center',  
        marginTop: 10,               
    },
    categoryText: {
        fontFamily: 'AnonymousPro-Regular',
        fontWeight: "400",
        fontSize: 16,
        color: '#FFFFFF',        
    },
    footer: {
        flexDirection: "column",        
        alignItems: "center",        
        marginTop: 25        
    },
    uploadButton:{
        width: "95%",
        height: 48,
        borderRadius: 100,
        backgroundColor: "#2B80BE",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 5
    },
    uploadButtonText: {
        fontFamily: "AnonymousPro-Bold",
        fontWeight: "700",
        fontSize: 18,
        color: "#FFFFFF",
    },
    helperText:{
        fontFamily: "AnonymousPro-Regular",
        fontWeight: "400",
        fontSize: 14,
        color: "#FFFFFF",         
    }
})