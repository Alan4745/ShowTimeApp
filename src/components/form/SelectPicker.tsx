import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import DropdownModal from '../modals/DropdownModal';

interface SelectPickerProps {
  label: string;
  placeholder: string;
  options: string[];
  selectedValue: string | null;
  onSelect: (value: string) => void;
  containerStyle?: any;
}

export default function SelectPicker({
  label,
  placeholder,
  options,
  selectedValue,
  onSelect,
  containerStyle,
}: SelectPickerProps) {
  const [showModal, setShowModal] = useState(false);

  const handleSelect = (value: string) => {
    onSelect(value);
    setShowModal(false);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.label}>{label}</Text>

      <TouchableOpacity
        style={[
          styles.selector,
          selectedValue && styles.selectedSelector,
        ]}
        onPress={() => setShowModal(true)}
      >
        <Text style={[
          styles.selectorText,
          selectedValue && styles.selectedSelectorText,
        ]}>
          {selectedValue || placeholder}
        </Text>
        <ChevronDown
          color={selectedValue ? '#4A90E2' : '#666'}
          size={20}
        />
      </TouchableOpacity>

      <DropdownModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        title={`Select ${label}`}
        items={options}
        onSelect={handleSelect}
        renderItem={(item) => item}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  selector: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#333',
    borderRadius: 25,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 56,
  },
  selectedSelector: {
    borderColor: '#4A90E2',
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
  },
  selectorText: {
    fontSize: 16,
    color: '#666',
    flex: 1,
    textAlign: 'center',
  },
  selectedSelectorText: {
    color: '#fff',
    fontWeight: '500',
  },
});
