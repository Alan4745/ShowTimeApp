import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

type Props = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (comment: string) => void;
};

const MAX_LENGTH = 200;

export default function CommentModal({ visible, onClose, onSubmit }: Props) {
  const [comment, setComment] = useState('');

  useEffect(() => {
    if (!visible) {
      setComment('');
    }
  }, [visible]);
  const handleSend = () => {
    if (comment.trim().length > 0) {
      onSubmit(comment.trim());
      setComment('');
      onClose();
    }
  };

  const handleCancel = () => {
    setComment('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>

          {/* Botón de cerrar */}
          <TouchableOpacity onPress={handleCancel} style={styles.closeButton}>
            <Text style={styles.closeText}>×</Text>
          </TouchableOpacity>

          {/* Campo de texto */}
          <TextInput
            style={styles.input}
            multiline
            maxLength={MAX_LENGTH}
            placeholder="Write your comment..."
            placeholderTextColor="#999"
            value={comment}
            onChangeText={setComment}            
          />

          {/* Contador */}
          <Text style={styles.counter}>
            {comment.length} / {MAX_LENGTH}
          </Text>

          {/* Botón de enviar */}
          <TouchableOpacity
            style={[styles.sendButton, comment.trim().length === 0 && styles.disabled]}
            onPress={handleSend}
            disabled={comment.trim().length === 0}
          >
            <Text style={[styles.sendText, comment.trim().length === 0 && styles.disabledText]}>Send</Text>
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
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: '#121212',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    minHeight: "30%",
    position: 'relative',
    justifyContent:"center"
  },
  closeButton: {
    position: 'absolute',
    top: 6,
    right: 10,
    zIndex: 2,
  },
  closeText: {
    fontSize: 28,
    color: '#fff',
  },
  input: {
    fontFamily: 'AnonymousPro-Regular',
    fontWeight: "400",
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    borderRadius: 8,
    padding: 10,
    color: '#fff',
    minHeight: 130,
    marginTop: 30,    
  },
  counter: {
    alignSelf: 'flex-end',
    marginTop: 5,
    color: '#aaa',
    fontSize: 12,
  },
  sendButton: {
    width: "50%",
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 10,
    alignItems: 'center',
    alignSelf: "center"
  },
  sendText: {
    color: '#2B80BE',
    fontSize: 16,
    fontWeight: '500',
  },
  disabled: {
     backgroundColor: '#2B80BE',
  },
  disabledText: {
     color: '#FFFFFF',
  },
});
