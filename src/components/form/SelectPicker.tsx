import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import DropdownModal from '../modals/DropdownModal';

interface SelectOption {
  label: string;
  value: string;
}

interface SelectPickerProps {
  label: string;
  placeholder: string;
  options: SelectOption[];
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

  const selectedLabel = options.find(opt => opt.value === selectedValue)?.label || placeholder;

  const handleSelect = (label: string) => {
    const selectedOption = options.find(opt => opt.label === label);
    if (selectedOption) {onSelect(selectedOption.value);}
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
          {selectedLabel}
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
        items={options.map(opt => opt.label)}
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
    fontFamily: 'AnonymousPro-Bold',
    fontSize: 26,
    fontWeight: '700',
    lineHeight: 26,
    color: '#fff',
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
    fontFamily: 'AnonymousPro-Regular',
    fontSize: 20,
    fontWeight: '400',
    lineHeight: 20,
    color: '#666',
    flex: 1,
    textAlign: 'center',
  },
  selectedSelectorText: {
    color: '#fff',
  },
});
