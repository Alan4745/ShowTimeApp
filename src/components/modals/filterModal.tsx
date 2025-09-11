import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { X, SlidersHorizontal } from 'lucide-react-native';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: {
    subcategory?: string;
    format?: string;
    sortByName?: 'asc' | 'desc';
  }) => void;
  onClear: () => void;
}

const subcategories = ['Workout', 'Gymflow', 'Drills', 'Recovery'];
const formats = ['Video', 'Image', 'Text', 'Voice'];

export default function FilterModal({ visible, onClose, onApply, onClear }: FilterModalProps) {
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<string | null>(null);
  const [sortByName, setSortByName] = useState<'asc' | 'desc' | null>(null);

  const handleClear = () => {
    setSelectedSubcategory(null);
    setSelectedFormat(null);
    setSortByName(null);
    onClear();
  };

  const handleApply = () => {
    onApply({
      subcategory: selectedSubcategory || undefined,
      format: selectedFormat || undefined,
      sortByName: sortByName || undefined,
    });
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <SlidersHorizontal size={20} color="#FFFFFF" />
            <Text style={styles.headerText}>Filter</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Subcategory */}
          <Text style={styles.sectionTitle}>Subcategory</Text>
          <View style={styles.optionRow}>
            {subcategories.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionButton,
                  selectedSubcategory === option && styles.optionSelected,
                ]}
                onPress={() => setSelectedSubcategory(option)}
              >
                <Text style={[
                    styles.optionText, 
                    selectedSubcategory === option && styles.optionTextSelected,]}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Format */}
          <Text style={styles.sectionTitle}>Format</Text>
          <View style={styles.optionRow}>
            {formats.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionButton,
                  selectedFormat === option && styles.optionSelected,
                ]}
                onPress={() => setSelectedFormat(option)}
              >
                <Text 
                    style={[
                        styles.optionText,
                        selectedFormat === option && styles.optionTextSelected,
                    ]}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Coach Name */}
          <Text style={styles.sectionTitle}>Coach Name</Text>
          <View style={styles.optionRow}>
            {['asc', 'desc'].map((dir) => (
              <TouchableOpacity
                key={dir}
                style={[
                  styles.optionButton,
                  sortByName === dir && styles.optionSelected,
                ]}
                onPress={() => setSortByName(dir as 'asc' | 'desc')}
              >
                <Text 
                style={[
                    styles.optionText,
                    sortByName === dir && styles.optionTextSelected,    
                ]}>{dir.toUpperCase()}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Action buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
              <Text style={styles.clearText}>Clear</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
              <Text style={styles.applyText}>Apply</Text>
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
    backgroundColor: '#000000cc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '70%',
    maxWidth: 400,
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 20,
    alignSelf: "center"
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerText: {
    fontFamily: 'AnonymousPro-Bold',
    fontWeight: '700',
    fontSize: 20,
    color: '#FFFFFF',
  },
  sectionTitle: {
    fontFamily: 'AnonymousPro-Bold',
    fontWeight: "700",
    color: '#FFFFFF',
    fontSize: 18,
    marginTop: 10,
    marginBottom: 15,
  },
  optionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: "space-between",
    marginBottom: 10,
    rowGap: 6,
  },
  optionButton: {
    borderWidth: 1,
    borderColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
    marginRight: 8,
    marginBottom: 8,
    width: "45%",
    alignItems: "center"
  },
  optionSelected: {
    backgroundColor: '#FFFFFF',    
  },
  optionTextSelected:{
    color: '#2B80BE',
  },
  optionText: {
    fontFamily: 'AnonymousPro-Regular',
    fontWeight: "400",
    fontSize: 16,
    color: '#FFFFFF',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  clearButton: {
    borderWidth: 1,
    borderColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  applyButton: {
    backgroundColor: '#2B80BE',
    borderColor: '#2B80BE', 
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  clearText: {
    fontFamily: 'AnonymousPro-Bold',
    fontWeight: "700",
    fontSize: 16,
    color: '#FFFFFF',
  },
  applyText: {
    fontFamily: 'AnonymousPro-Bold',
    fontWeight: "700",
    fontSize: 16,
    color: '#FFFFFF',
  },
});
