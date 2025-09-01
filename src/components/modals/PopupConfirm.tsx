import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';

interface PopupConfirmProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function PopupConfirm({
  visible,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancelar',
  onConfirm,
  onCancel,
}: PopupConfirmProps) {   

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View style={styles.popup}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
              <Text style={styles.cancelText}>{cancelText}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onConfirm} style={styles.confirmButton}>
              <Text style={styles.confirmText}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
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
  popup: {
    backgroundColor: '#1a1a1a',
    width: Dimensions.get('window').width * 0.8,
    borderRadius: 18,
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontFamily: 'AnonymousPro-Bold',
    fontSize: 20,
    fontWeight: "700",
    color: '#FFFFFF',
    marginBottom: 15,
  },
  message: {
    fontFamily: 'AnonymousPro-Regular',
    fontSize: 16,
    fontWeight: "400",
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 25,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 30,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 30,
    backgroundColor: '#444',
    alignItems: 'center',
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 30,
    backgroundColor: '#2B80BE',
    alignItems: 'center',
  },
  cancelText: {
    color: '#FFFFFF',    
    fontFamily: 'AnonymousPro-Regular',
    fontWeight: "400",
    fontSize: 14,
  },
  confirmText: {
    color: '#FFFFFF',
    fontFamily: 'AnonymousPro-Bold',
    fontWeight: "400",
    fontSize: 14,
  },
});
