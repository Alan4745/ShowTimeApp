import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import {X} from 'lucide-react-native';
import FormInput from '../form/FormInput';

interface HighlightModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function HighlightModal({ visible, onClose }: HighlightModalProps) {
  const {t} = useTranslation();
  const [link, setLink] = useState('');

  const handleSubmit = () => {
    console.log('YouTube Link:', link); // aquí recupera el link. para enviar a API
    onClose();
    setLink('');
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <X size={22} color={"#FFFFFF"}/>
            </TouchableOpacity>

            <Text style={styles.title}>{t('modalTitles.highlights')}</Text>

            <FormInput
                placeholder="https://youtube.com/..."
                value={link}
                onChangeText={setLink}
            />

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>{t('common.send')}</Text>
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
  modalContainer: {
    width: '85%',
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 20,
  },
  closeButton: {
    marginBottom: 12,
    alignItems: 'flex-end',
  },
  title: {
    fontFamily: 'AnonymousPro-Bold',
    fontWeight: "700",
    fontSize: 20,
    color: '#FFFFFF',
    marginBottom: 40,
    alignSelf: "center"
  },
  button: {
    width: "45%",
    backgroundColor: '#2B80BE',
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 25,
    alignSelf: "center"
  },
  buttonText: {
    fontFamily: 'AnonymousPro-Regular',
    fontWeight: "400",
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
  } 
});
