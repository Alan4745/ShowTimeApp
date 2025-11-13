import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Keyboard,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import {
  ChevronDown,
  FileVideo,
  Image as ImageIcon,
  FileText,
} from 'lucide-react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import {pick, types} from '@react-native-documents/picker';
import {errorCodes, isErrorWithCode} from '@react-native-documents/picker';
import {generateLocalThumbnail} from '../utils/generateLocalThumbnail';
import {ScrollView} from 'react-native-gesture-handler';
import {useAuth} from '../context/AuthContext';
import ScreenLayout from '../components/common/ScreenLayout';
import DropdownModal from '../components/modals/DropdownModal';
import LottieIcon from '../components/common/LottieIcon';
import loadingAnimation from '../../assets/lottie/loading.json';
import categoriesByUserType from '../data/categoriesByUser';
import API_BASE_URL from '../config/api';

// Mapeo de coachingRole a categoría fija
const COACHING_ROLE_TO_CATEGORY: {[key: string]: string} = {
  'Performance Coach': 'training',
  'Nutrition': 'nutrition',
  'Game analysis': 'tactics',
  'Drill/ Technical': 'training', // Coincide con el valor del backend
  'Mindset': 'mindset',
};

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
  const navigation = useNavigation();
  const {token, user} = useAuth();
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertVisible, setAlertVisible] = useState(false);
  const darwinCategories = categoriesByUserType.admin;
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // Determinar si el usuario es Darwin (admin) o coach
  const isDarwin = user?.role === 'admin';

  const [mainCategory, setMainCategory] = useState<string | null>(null);
  const [subCategory, setSubCategory] = useState<string | null>(null);

  // Efecto para establecer la categoría fija al cargar
  useEffect(() => {
    console.log('👤 Usuario:', user);
    console.log('🔑 CoachingRole:', user?.coachingRole);
    console.log('🎯 isDarwin:', isDarwin);

    // Si es coach, fijar la categoría según su coachingRole
    if (!isDarwin && user?.coachingRole) {
      const fixedCategory = COACHING_ROLE_TO_CATEGORY[user.coachingRole];
      console.log('📌 Categoría fija asignada:', fixedCategory);
      if (fixedCategory) {
        setMainCategory(fixedCategory);
      }
    }
  }, [user, isDarwin]);
  const [isMainCategoryModalVisible, setMainCategoryModalVisible] =
    useState(false);
  const [isSubCategoryModalVisible, setSubCategoryModalVisible] =
    useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const courseId = 1; //Reemplazar luego.

  // Selección de video desde galeria
  const handleVideoSelect = () => {
    Keyboard.dismiss();
    const options = {
      mediaType: 'video' as const,
      videoQuality: 'high' as const,
      selectionLimit: 1,
    };

    launchImageLibrary(options, async response => {
      if (
        response.didCancel ||
        !response.assets ||
        response.assets.length === 0
      )
        return;

      const video = response.assets[0];
      const baseItem: MediaItem = {
        id: `${Date.now()}`,
        type: 'video',
        uri: video.uri!,
      };

      try {
        const message = {
          id: baseItem.id,
          sender: user?.role,
          text: '',
          timestamp: new Date().toISOString(),
          fileUrl: baseItem.uri,
          fileType: 'video' as const,
        };

        const withThumb = await generateLocalThumbnail(message);
        const newVideo: MediaItem = {
          ...baseItem,
          thumbnail: withThumb.fileThumbnail,
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

    launchImageLibrary(options, response => {
      if (
        response.didCancel ||
        !response.assets ||
        response.assets.length === 0
      )
        return;

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
      const [res] = await pick({type: [types.pdf]});

      if (!res) throw new Error('No PDF selected');

      const pdfItem: MediaItem = {
        id: `${Date.now()}`,
        type: 'pdf',
        uri: res.uri,
        thumbnail: Image.resolveAssetSource(
          require('../../assets/img/Adobe.png'),
        ).uri, // thumbnail estático
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

  const handleUploadLesson = async () => {
    if (!currentMedia) {
      setAlertMessage('Selecciona un archivo primero');
      setAlertVisible(true);
      return;
    }

    setIsUploading(true); //Muestra Loader

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('subcategory', subCategory || '');
    formData.append(
      'format',
      currentMedia.type === 'video'
        ? 'Video'
        : currentMedia.type === 'image'
        ? 'Image'
        : 'PDF',
    );

    // Archivo principal
    formData.append('media', {
      uri: currentMedia.uri,
      type: currentMedia.type === 'video' ? 'video/mp4' : 'image/jpeg',
      name: `lesson_upload_${Date.now()}.${
        currentMedia.type === 'video' ? 'mp4' : 'jpg'
      }`,
    } as any);

    // Thumbnail opcional
    if (currentMedia.thumbnail) {
      formData.append('thumbnail', {
        uri: currentMedia.thumbnail,
        type: 'image/jpeg',
        name: `thumbnail_${Date.now()}.jpg`,
      } as any);
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/courses/${courseId}/lessons/create`,
        {
          method: 'POST',
          headers: {
            Authorization: `Token ${token}`,
            // No pongas 'Content-Type' → fetch lo hace solo
          },
          body: formData,
        },
      );

      if (!response.ok) {
        const errData = await response.text();
        console.error('Error al subir lección:', errData);
        setAlertMessage('Error al subir la lección');
        setAlertVisible(true);
        return;
      }
      // En caso se necesite usar la respuesta
      //const data = await response.json();

      // Espera 1 segundo para mostrar el loader un momento
      setTimeout(() => {
        setIsUploading(false);
        navigation.goBack(); // volver a la pantalla anterior
      }, 1000);
    } catch (error) {
      console.error('Error de red:', error);
      setAlertMessage('Error de red al subir la lección');
      setAlertVisible(true);
      setIsUploading(false);
    }
  };

  // Muestra animación al enviar formulario
  if (isUploading) {
    return (
      <View style={styles.loadingContainer}>
        <LottieIcon
          source={loadingAnimation}
          size={200}
          loop={true}
          autoPlay={true}
        />
        <Text style={styles.loadingText}>Subiendo contenido...</Text>
      </View>
    );
  }

  const currentMedia = mediaItems[0];
  return (
    <ScreenLayout>
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 140, // Ajusta según el espacio necesario al final
          flexGrow: 1,
        }}
        keyboardShouldPersistTaps="handled">
        {/* HEADER */}
        <View style={styles.pageTitleContainer}>
          <Text style={styles.titleText}>
            {t('account.titles.uploadContent')}
          </Text>
        </View>

        {/* THUMBNAIL */}
        <Text style={styles.thumbnailText}>Thumbnail</Text>
        <View style={styles.imageContainer}>
          {currentMedia ? (
            <Image
              source={{uri: currentMedia.thumbnail || currentMedia.uri}}
              style={[
                styles.thumbnailImage,
                currentMedia.type === 'pdf' && styles.pdfThumbnailImage,
              ]}
              resizeMode={currentMedia.type === 'pdf' ? 'contain' : 'cover'}
            />
          ) : (
            <Text style={{color: 'gray', alignSelf: 'center'}}>
              {t('account.titles.noThumbnail')}
            </Text>
          )}
        </View>

        {/* TITLE AND DESCRIPTION INPUT */}
        <View style={styles.inputContainer}>
          <View style={styles.titleInputContainer}>
            <TextInput
              style={[styles.titleInput]}
              placeholder={t('account.placeholders.inputTitle')}
              placeholderTextColor="#929292"
              value={title}
              onChangeText={setTitle}
            />
          </View>
          <View style={styles.descriptionInputContainer}>
            <TextInput
              multiline
              style={[styles.descriptionInput]}
              placeholder={t('account.placeholders.inputDescription')}
              placeholderTextColor="#929292"
              value={description}
              onChangeText={setDescription}
            />
          </View>
        </View>

        {/* File Buttons */}
        <Text style={styles.fileFormatText}>
          {t('account.titles.fileFormat')}
        </Text>
        <View style={styles.fileButtonsContainer}>
          <TouchableOpacity
            style={styles.fileButton}
            onPress={handleVideoSelect}>
            <FileVideo size={18} color="#FFFFFF" />
            <Text style={styles.fileButtonText}>
              {t('publishPost.buttons.video')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.fileButton}
            onPress={handleImageSelect}>
            <ImageIcon size={18} color="#FFFFFF" />
            <Text style={styles.fileButtonText}>
              {t('publishPost.buttons.image')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.fileButton} onPress={handlePDFSelect}>
            <FileText size={18} color="#FFFFFF" />
            <Text style={styles.fileButtonText}>
              {t('publishPost.buttons.text')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Category Select */}
        <Text style={styles.categoryTitleText}>
          {t('account.titles.category')}
        </Text>
        <View style={styles.categoryContainer}>
          {/* MAIN CATEGORY BUTTON - Solo editable para Darwin */}
          {isDarwin ? (
            <TouchableOpacity
              style={styles.categorySelector}
              onPress={() => setMainCategoryModalVisible(true)}>
              <Text style={styles.categoryText}>
                {mainCategory
                  ? t(`publishPost.categories.${mainCategory}`)
                  : t('account.placeholders.mainCategory')}
              </Text>
              <ChevronDown size={18} color="#fff" />
            </TouchableOpacity>
          ) : (
            <View
              style={[styles.categorySelector, styles.fixedCategorySelector]}>
              <Text style={styles.categoryText}>
                {mainCategory
                  ? t(`publishPost.categories.${mainCategory}`)
                  : t('account.placeholders.mainCategory')}
              </Text>
            </View>
          )}

          {/* SUBCATEGORY BUTTON - Editable para todos */}
          <TouchableOpacity
            style={[
              styles.categorySelector,
              !mainCategory && {opacity: 0.5}, // Visual hint for disabled
            ]}
            onPress={() => {
              if (mainCategory) setSubCategoryModalVisible(true);
            }}
            disabled={!mainCategory}>
            <Text style={styles.categoryText}>
              {subCategory
                ? t(`publishPost.categories.${subCategory}`)
                : t('account.placeholders.subcategory')}
            </Text>
            <ChevronDown size={18} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={handleUploadLesson}>
            <Text style={styles.uploadButtonText}>
              {t('account.buttons.uploadContent')}
            </Text>
          </TouchableOpacity>
          <Text style={styles.helperText}>
            {t('helperTexts.uploadHelperText1')}
          </Text>
          <Text style={styles.helperText}>
            {t('helperTexts.uploadHelperText2')}
          </Text>
        </View>

        {/* MAIN CATEGORY MODAL */}
        <DropdownModal
          visible={isMainCategoryModalVisible}
          onClose={() => setMainCategoryModalVisible(false)}
          title={t('account.titles.selectMainCategory')}
          items={Object.keys(darwinCategories)}
          onSelect={selectedCategory => {
            console.log('📘 Main category seleccionada:', selectedCategory);
            setMainCategory(selectedCategory);
            setSubCategory(null); // Reset subcategory when main changes
            setMainCategoryModalVisible(false);
          }}
          renderItem={item => t(`publishPost.categories.${item}`)}
        />

        {/* SUBCATEGORY MODAL */}
        <DropdownModal
          visible={isSubCategoryModalVisible}
          onClose={() => setSubCategoryModalVisible(false)}
          title={t('account.titles.selectSubcategory')}
          items={mainCategory ? (darwinCategories as any)[mainCategory] : []}
          onSelect={selectedSubCategory => {
            console.log('📗 Subcategory seleccionada:', selectedSubCategory);
            setSubCategory(selectedSubCategory);
            setSubCategoryModalVisible(false);
          }}
          renderItem={item => t(`publishPost.categories.${item}`)}
        />
      </ScrollView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  pageTitleContainer: {
    marginTop: 25,
    alignSelf: 'center',
  },
  titleText: {
    fontFamily: 'AnonymousPro-Bold',
    fontWeight: '700',
    fontSize: 22,
    color: '#FFFFFF',
  },
  thumbnailText: {
    fontFamily: 'AnonymousPro-Bold',
    fontWeight: '700',
    fontSize: 18,
    color: '#FFFFFF',
    marginTop: 25,
    marginLeft: 10,
  },
  imageContainer: {
    width: '95%',
    height: '20%',
    alignSelf: 'center',
    borderRadius: 10,
    marginTop: 10,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  pdfThumbnailImage: {
    width: '100%',
    height: '100%',
    alignSelf: 'center',
  },
  inputContainer: {
    flexDirection: 'column',
    width: '95%',
    alignSelf: 'center',
    marginTop: 20,
    gap: 15,
  },
  titleInputContainer: {
    height: 55,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  titleInput: {
    fontFamily: 'AnonymousPro-Regular',
    fontWeight: '400',
    fontSize: 16,
    color: '#929292',
  },
  descriptionInputContainer: {
    height: 135,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  descriptionInput: {
    fontFamily: 'AnonymousPro-Regular',
    fontWeight: '400',
    fontSize: 16,
    color: '#929292',
    textAlign: 'justify',
  },
  fileFormatText: {
    fontFamily: 'AnonymousPro-Bold',
    fontWeight: '700',
    fontSize: 18,
    color: '#FFFFFF',
    marginTop: 15,
    marginLeft: 10,
  },
  fileButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 15,
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
    fontWeight: '400',
    fontSize: 14,
    color: '#FFFFFF',
  },
  categoryTitleText: {
    fontFamily: 'AnonymousPro-Bold',
    fontWeight: '700',
    fontSize: 18,
    color: '#FFFFFF',
    marginTop: 5,
    marginLeft: 10,
  },
  categoryContainer: {
    flexDirection: 'column',
    gap: 10,
    alignItems: 'center',
  },
  categorySelector: {
    flexDirection: 'row',
    width: '95%',
    height: 45,
    justifyContent: 'space-between',
    borderColor: '#ADADAD',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  categoryText: {
    fontFamily: 'AnonymousPro-Regular',
    fontWeight: '400',
    fontSize: 16,
    color: '#FFFFFF',
  },
  fixedCategorySelector: {
    backgroundColor: '#1A1A1A',
    opacity: 0.7,
  },
  footer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 25,
  },
  uploadButton: {
    width: '95%',
    height: 48,
    borderRadius: 100,
    backgroundColor: '#2B80BE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  uploadButtonText: {
    fontFamily: 'AnonymousPro-Bold',
    fontWeight: '700',
    fontSize: 18,
    color: '#FFFFFF',
  },
  helperText: {
    fontFamily: 'AnonymousPro-Regular',
    fontWeight: '400',
    fontSize: 14,
    color: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: 'AnonymousPro-Regular',
    fontWeight: '400',
    color: '#fff',
    marginTop: 20,
    fontSize: 18,
  },
});
