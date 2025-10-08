import React, {useState} from 'react';
import {Modal, View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import { useTranslation } from 'react-i18next';
import ImagePicker from 'react-native-image-crop-picker';
import PopupAlert from './PopupAlert';
import {X} from 'lucide-react-native'

interface ImagePickerModalProps {
  visible: boolean;
  onClose: () => void;
  onImagePicked: (image: { path: string; mime: string; filename: string }) => void;
}

function extractFilenameFromPath(path: string): string {
  return path.split('/').pop() || `image_${Date.now()}.jpg`;
}

export default function ImagePickerModal({
  visible,
  onClose,
  onImagePicked,
}: ImagePickerModalProps) {
  const {t} = useTranslation();  
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const VALID_IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];

  const showError = (message: string) => {
    setErrorMessage(message);
    setErrorModalVisible(true);
  };

  const handlePickFromGallery = async () => {
    try {
      const image = await ImagePicker.openPicker({
        width: 800,
        height: 800,
        cropping: true,
        cropperCircleOverlay: true,
        freeStyleCropEnabled: false,
        compressImageQuality: 0.8,
        mediaType: 'photo',
      });

      if (!VALID_IMAGE_MIME_TYPES.includes(image.mime)) {
        showError(t('errors.invalidImageType') || 'Only JPEG, JPG or PNG images are allowed');
        return;
      }

      const filename = extractFilenameFromPath(image.path)
      onImagePicked({
        path: image.path,
        mime: image.mime,
        filename,
      });
      onClose();
    } catch (error: any) {
      if (error.code !== 'E_PICKER_CANCELLED') {        
        console.error(error);
        showError(t('errors.galleryAccessError') || 'Unable to access the image galery');
      }
    }
  };

  const handleTakePhoto = async () => {
    try {
      const image = await ImagePicker.openCamera({
        width: 800,
        height: 800,
        cropping: true,
        cropperCircleOverlay: true,
        freeStyleCropEnabled: false,
        compressImageQuality: 0.8,
        mediaType: 'photo'
      });

      if (!VALID_IMAGE_MIME_TYPES.includes(image.mime)) {
        showError(t('errors.invalidImageType') || 'Only JPEG, JPG or PNG images are allowed');
        return;
      }

      const filename = extractFilenameFromPath(image.path);
      onImagePicked({
        path: image.path,
        mime: image.mime,
        filename,  
      });
      onClose();
    } catch (error: any) {
      if (error.code !== 'E_PICKER_CANCELLED') {
        console.error(error);
        showError(t('errors.cameraAccessError') || 'Unable to access the camera');
      }      
    }
  };


  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>        
        <View style={styles.container}>
          <TouchableOpacity onPress={onClose}>
            <X size={24} style={styles.close}/>
          </TouchableOpacity>  
          <Text style={styles.title}>{t('modalTitles.selectImage')}</Text>
          <TouchableOpacity style={styles.button} onPress={handleTakePhoto}>
            <Text style={styles.buttonText}>{t('modalTitles.buttonOptions.useCamera')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handlePickFromGallery}>
            <Text style={styles.buttonText}>{t('modalTitles.buttonOptions.chooseGalery')}</Text>
          </TouchableOpacity>          
        </View>

        {/* Error Modal */}
        <PopupAlert
        visible={errorModalVisible}
        message={errorMessage}
        onClose={() => setErrorModalVisible(false)}
      />
      </View>      
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: "80%",
    height: 275,
    backgroundColor: '#252A30',
    borderRadius: 10,
    padding: 20,    
  },
  close: {
    color: "#FFFFFF",
    marginBottom: 15,
    alignSelf: "flex-end"    
  },
  title: {
    fontFamily: "AnonymousPro-Regular",
    fontWeight: '400',
    color: "#FFFFFF",
    fontSize: 20,
    marginBottom: 35,
    alignSelf: "center"
  },
  button: {
    minWidth: '60%',
    backgroundColor: '#2B80BE',
    paddingVertical: 14,
    paddingHorizontal: 5,
    borderRadius: 10,
    marginBottom: 22,
    alignSelf: "center"
  },
  buttonText: {
    fontFamily: "AnonymousPro-Regular",
    fontWeight: '400',
    color: "#FFFFFF",
    fontSize: 16,
    textAlign: "center"
  }
});
