import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';

interface DualButtonSelectorProps {
  leftOption: string;
  rightOption: string;
  selectedOption: string | null;
  onSelect: (option: string) => void;
  containerStyle?: ViewStyle;
}

export default function DualButtonSelector({
  leftOption,
  rightOption,
  selectedOption,
  onSelect,
  containerStyle,
}: DualButtonSelectorProps) {
  return (
    <View style={[styles.container, containerStyle]}>
      <TouchableOpacity
        style={[
          styles.button,
          selectedOption === leftOption && styles.selectedButton,
        ]}
        onPress={() => onSelect(leftOption)}
      >
        <Text
          style={[
            styles.buttonText,
            selectedOption === leftOption && styles.selectedButtonText,
          ]}
        >
          {leftOption}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.button,
          selectedOption === rightOption && styles.selectedButton,
        ]}
        onPress={() => onSelect(rightOption)}
      >
        <Text
          style={[
            styles.buttonText,
            selectedOption === rightOption && styles.selectedButtonText,
          ]}
        >
          {rightOption}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedButton: {
    backgroundColor: '#2B80BE',
    borderColor: '#2B80BE',
  },
  buttonText: {
    fontFamily: 'AnonymousPro-Regular',
    fontSize: 20,
    fontWeight: '400',
    lineHeight: 20,
    color: '#929292',
  },
  selectedButtonText: {
    color: '#FFFFFF',
  },
});
