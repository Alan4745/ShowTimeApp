import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface OptionButtonProps {
  title: string;
  selected: boolean;
  onPress: () => void;
  style?: any;
  textStyle?: any;
}

export default function OptionButton({
  title,
  selected,
  onPress,
  style,
  textStyle,
}: OptionButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        selected && styles.selectedButton,
        style,
      ]}
      onPress={onPress}
    >
      <Text style={[
        styles.text,
        selected && styles.selectedText,
        textStyle,
      ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#333',
    borderRadius: 25,
    paddingVertical: 16,
    paddingHorizontal: 40,
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: '#4A90E2',
    borderColor: '#4A90E2',
  },
  text: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  selectedText: {
    color: '#fff',
  },
});
