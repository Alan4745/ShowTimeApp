import React, { useState, useEffect } from 'react';
import {Modal, View, Text, StyleSheet, TouchableOpacity, TextInput, Image, ScrollView} from 'react-native';
import { launchImageLibrary} from 'react-native-image-picker';
import { pick, types, errorCodes, isErrorWithCode } from '@react-native-documents/picker';
import { createThumbnail } from 'react-native-create-thumbnail';
import { useTranslation } from 'react-i18next';
import { X, FileVideo, FileText, Image as ImageIcon, ImageOff } from 'lucide-react-native';

type PreviewType = {
  type: 'image' | 'video' | 'pdf';
  uri: string;
  name?: string;
  thumbnail?: string;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  onSend: (file: PreviewType, caption: string) => void;
  initialCaption?: string;
};

export default function AttachmentModal({ visible, onClose, onSend, initialCaption }: Props) {
  const {t} = useTranslation();
  const [preview, setPreview] = useState<PreviewType | null>(null);
  const [caption, setCaption] = useState(initialCaption);
  const [inputHeight, setInputHeight] = useState(40);

  // colocar mensaje, si ya fue ingresado uno
    useEffect(() => {
    if (visible) {
      setCaption(initialCaption); 
    }
  }, [visible, initialCaption]);

  // Seleccionar Video desde galería
  const handleVideoSelect = () => {
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

        setPreview({
          type: 'video',
          uri: video.uri!,
          name: video.fileName ?? 'video.mp4',
          thumbnail: thumbnail.path,          
        });
      } catch (err) {
        console.error('Error generating video thumbnail:', err);
        // Si tienes alertas visibles, puedes manejarlas aquí también.
      }
    });
  }; 
  
  // Seleccionar Imagen desde galería
  const handleImageSelect = () => {
    const options = {
      mediaType: 'photo' as const,
      selectionLimit: 1,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel || !response.assets || response.assets.length === 0) return;

      const asset = response.assets[0];

      setPreview({
        type: 'image',
        uri: asset.uri!,
        name: asset.fileName ?? 'imagen.jpg',
        thumbnail: asset.uri!,
      });
    });
  };

  // Seleccionar PDF desde galería
  const handlePDFSelect = async () => {
    try {
      const [res] = await pick({ type: [types.pdf] });

      if (!res) return;

      setPreview({
        type: 'pdf',
        uri: res.uri,
        name: res.name ?? 'Documento',
        thumbnail: Image.resolveAssetSource(require('../../../assets/img/Adobe.png')).uri,
      });
    } catch (err) {
      if (isErrorWithCode(err) && err.code !== errorCodes.OPERATION_CANCELED) {
        console.error('Error al seleccionar PDF:', err.message);
      } else {
        console.error('Error inesperado al seleccionar PDF:', err);
      }
    }
  }; 

  const handleSend = () => {
    if (!preview) return;
    onSend(preview, caption);
    resetModal();
  };

  const resetModal = () => {
    setPreview(null);
    setCaption('');
    onClose();
  };

  return (    
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Cerrar modal */}
          <TouchableOpacity onPress={resetModal} style={styles.closeButton}>
            <X size={28} color="#FFFFFF" />
          </TouchableOpacity>
          
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* Vista previa */}
            {preview ? (
              <View style={styles.previewContainer}>
                {preview.thumbnail ? (
                  <Image
                    source={{ uri: preview.thumbnail }}
                    style={styles.thumbnail}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.thumbnailFallback}>
                    <ImageOff size={64} color="#FFFFFF" />
                  </View>
                )}

                <Text style={styles.previewText}>{preview.name}</Text>
              </View>
            ) : (
              <View style={styles.fileSelectContainer}>
                <Text style={styles.fileSelectTitle}>{t('account.titles.selectAFile')}</Text>             

                {/* FILE BUTTONS */}              
                <View style={styles.fileButtonsContainer}>
                  {/* VIDEO */}
                  <TouchableOpacity style={styles.fileButton} onPress={handleVideoSelect}>
                    <FileVideo size={18} color="#FFFFFF" />                
                    <Text style={styles.fileButtonText}>{t('publishPost.buttons.video')}</Text>
                  </TouchableOpacity>

                  {/* IMAGEN */}
                  <TouchableOpacity style={styles.fileButton} onPress={handleImageSelect}>
                    <ImageIcon size={18} color="#FFFFFF" />                
                    <Text style={styles.fileButtonText}>{t('publishPost.buttons.image')}</Text>
                  </TouchableOpacity>

                  {/* PDF */}
                  <TouchableOpacity style={styles.fileButton} onPress={handlePDFSelect}>
                    <FileText size={18} color="#FFFFFF" />
                    <Text style={styles.fileButtonText}>{t('publishPost.buttons.text')}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/*Mensaje de Texto Opcional */}
            {preview && (
              <>
                <TextInput
                  placeholder={t('placeholders.writeMessage')}
                  style={[styles.input, { height: Math.max(40, inputHeight) }]}
                  placeholderTextColor='#F7FAFC'
                  multiline
                  value={caption}
                  onChangeText={setCaption}
                  onContentSizeChange={(e) => {setInputHeight(e.nativeEvent.contentSize.height)}}
                />                
              </>
            )}
          </ScrollView>

          {/* Botón fijo */}
          {preview && (
            <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
              <Text style={styles.sendButtonText}>{t('account.buttons.send')}</Text>
            </TouchableOpacity>
          )} 

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#000000bb',
    justifyContent: 'center',
    padding: 20,
  },
  container: {
    position:"relative",
    backgroundColor: '#000000',
    borderColor: "#FFFFFF",
    borderWidth: 2,
    borderRadius: 12,
    padding: 20,
    minHeight: 300,
    maxHeight: "70%",
    justifyContent: "space-between"  ,  
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 2,
  },
  scrollContent:{
    paddingBottom: 20,
    flexGrow: 1,
  },  
  fileSelectContainer:{
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 30,
    flexGrow: 1,    
  }, 
  fileSelectTitle:{
    fontFamily: 'AnonymousPro-Bold',
    fontWeight: "700",
    fontSize: 22,
    color: "#F7FAFC" 
  }, 
  fileButtonsContainer: {       
    justifyContent: 'space-around',
    gap: 15,
    marginTop: 40,  
    paddingHorizontal: 10,    
  },
  fileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 160,
    borderWidth: 1.5,
    backgroundColor: '#2B80BE',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 15,  
    justifyContent: "center",
    textAlignVertical: "center",  
  },
  fileButtonText: {
    fontFamily: 'AnonymousPro-Regular',
    fontWeight: "400",
    fontSize: 18,
    color: '#FFFFFF',
    marginLeft: 10,
  },
  previewContainer: {
    alignItems: 'center',
    marginVertical: 20,
},
  thumbnail: {
    width: 200,
    height: 200,
    borderRadius: 8,
  },
  thumbnailFallback: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#333',
  },    
  previewText: {
    fontFamily: 'AnonymousPro-Regular',
    fontWeight: "400",
    fontSize: 16,
    color: '#F7FAFC',
    marginTop: 10,
    textAlign: 'center',
  },
  input: {
    fontFamily: 'AnonymousPro-Regular',
    fontWeight: "400",
    fontSize: 16,
    borderWidth: 1.5,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
    marginBottom:15,
    color: '#F7FAFC',
    textAlignVertical: "top",
  },
  sendButton: {
    backgroundColor: '#2B80BE',
    padding: 12,
    borderRadius: 13,
    marginTop: 10,
  },
  sendButtonText: {
    fontFamily: 'AnonymousPro-Regular',
    fontWeight: "400",
    fontSize: 16,
    color: '#F7FAFC',
    textAlign: 'center',
  },
});
