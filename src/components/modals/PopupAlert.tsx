import React from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface PopupAlertProps {
  visible: boolean;
  message: string;
  onClose: () => void;
}

export default function PopupAlert({ visible, message, onClose }: PopupAlertProps) {
  const {t} = useTranslation();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.alertBox}>
          <Text style={styles.message}>{message}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>{t('modalTitles.buttonOptions.close')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertBox: {
    backgroundColor: '#1a1a1a',
    padding: 24,
    borderRadius: 18,
    alignItems: 'center',
    width: '80%',
  },
  message: {
    fontFamily: 'AnonymousPro-Regular',
    fontSize: 16,
    lineHeight: 22,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 25,
  },
  closeButton: {
    backgroundColor: '#2B80BE',
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  closeText: {
    color: '#FFFFFF',
    fontFamily: 'AnonymousPro-Bold',
    fontSize: 16,
    fontWeight: "400",

  },
});
