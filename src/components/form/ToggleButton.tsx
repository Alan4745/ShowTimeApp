import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface ToggleButtonProps {
  leftOption: string;
  rightOption: string;
  selectedOption: string | null;
  onSelect: (option: string) => void;
  containerStyle?: any;
}

export default function ToggleButton({
  leftOption,
  rightOption,
  selectedOption,
  onSelect,
  containerStyle,
}: ToggleButtonProps) {
  return (
    <View style={[styles.container, containerStyle]}>
      <TouchableOpacity
        style={[
          styles.option,
          styles.leftOption,
          selectedOption === leftOption && styles.selectedOption,
        ]}
        onPress={() => onSelect(leftOption)}
      >
        <Text style={[
          styles.optionText,
          selectedOption === leftOption && styles.selectedOptionText,
        ]}>
          {leftOption}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.option,
          styles.rightOption,
          selectedOption === rightOption && styles.selectedOption,
        ]}
        onPress={() => onSelect(rightOption)}
      >
        <Text style={[
          styles.optionText,
          selectedOption === rightOption && styles.selectedOptionText,
        ]}>
          {rightOption}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#333',
    borderRadius: 25,
    overflow: 'hidden',
    height: 56,
  },
  option: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  leftOption: {
    borderTopLeftRadius: 23,
    borderBottomLeftRadius: 23,
  },
  rightOption: {
    borderTopRightRadius: 23,
    borderBottomRightRadius: 23,
  },
  selectedOption: {
    backgroundColor: '#4A90E2',
  },
  optionText: {
    fontFamily: 'AnonymousPro-Regular',
    fontSize: 20,
    fontWeight: '400',
    lineHeight: 20,
    color: '#666',
  },
  selectedOptionText: {
    color: '#fff',
  },
});
