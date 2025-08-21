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
    borderWidth: 1,
    borderColor: '#FFFFFF',
    borderRadius: 25,
    paddingVertical: 14,
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: '#2B80BE',
    borderColor: '#2B80be',
  },
  text: {
    fontFamily: 'AnonymousPro-Regular',
    fontSize: 20,
    fontWeight: '400',
    lineHeight: 20,
    color: '#929292',
  },
  selectedText: {
    color: '#FFFFFF',
  },
});
