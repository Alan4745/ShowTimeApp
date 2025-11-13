import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface QuickSelectItem {
  label: string;
  value: any;
}

interface QuickSelectGridProps {
  title: string;
  items: QuickSelectItem[];
  selectedValue?: any;
  onSelect: (value: any) => void;
  containerStyle?: any;
}

export default function QuickSelectGrid({
  title,
  items,
  selectedValue,
  onSelect,
  containerStyle,
}: QuickSelectGridProps) {
  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.grid}>
        {items.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.button,
              selectedValue === item.value && styles.selectedButton,
            ]}
            onPress={() => onSelect(item.value)}
          >
            <Text style={[
              styles.buttonText,
              selectedValue === item.value && styles.selectedButtonText,
            ]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  title: {
    color: '#666',
    fontSize: 14,
    marginBottom: 15,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    maxWidth: 320,
  },
  button: {
    backgroundColor: '#333',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 4,
  },
  selectedButton: {
    backgroundColor: '#4A90E2',
  },
  buttonText: {
    color: '#fff',
    fontSize: 11,
  },
  selectedButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
