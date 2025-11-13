import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

type EditFieldModalProps = {
  visible: boolean;
  title: string;
  initialValue: string;
  onClose: () => void;
  onSave: (value: string) => void;
};

export default function EditFieldModal({
  visible,
  title,
  initialValue,
  onClose,
  onSave,
}: EditFieldModalProps) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.modalContainer}>
        <Text style={styles.title}>{`Edit ${title}`}</Text>

        <TextInput
          style={styles.input}
          value={value}
          onChangeText={setValue}
          placeholder={`Enter ${title.toLowerCase()}`}
          placeholderTextColor="#999"
        />

        <View style={styles.buttons}>
          <TouchableOpacity onPress={onClose} style={styles.button}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onSave(value)} style={[styles.button, styles.saveButton]}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  modalContainer: {
    backgroundColor: '#222',
    padding: 20,
    borderRadius: 10,
    width: '85%',
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#333',
    color: '#fff',
    padding: 10,
    borderRadius: 6,
    fontSize: 16,
    marginBottom: 20,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#444',
    borderRadius: 6,
  },
  saveButton: {
    backgroundColor: '#1e90ff',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
