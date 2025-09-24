import React from 'react';
import {Modal, View, Text, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import { useTranslation } from 'react-i18next';
import ImagePicker from 'react-native-image-crop-picker';
import {X} from 'lucide-react-native'

interface ImagePickerModalProps {
  visible: boolean;
  onClose: () => void;
  onImagePicked: (image: { path: string; mime: string }) => void;
}

export default function ImagePickerModal({
  visible,
  onClose,
  onImagePicked,
}: ImagePickerModalProps) {
  const {t} = useTranslation();  
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
      onImagePicked(image);
      onClose();
    } catch (error: any) {
      if (error.code !== 'E_PICKER_CANCELLED') {
        Alert.alert('Error', 'Cannot access galery');
        console.error(error);
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
      onImagePicked(image);
      onClose();
    } catch (error: any) {
      if (error.code !== 'E_PICKER_CANCELLED') {
        Alert.alert('Error', 'Cannot access the camera.');
        console.error(error);
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
