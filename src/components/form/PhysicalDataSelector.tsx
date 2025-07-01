import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

interface PhysicalDataSelectorProps {
  weight: string;
  height: string;
  onWeightChange: (weight: string) => void;
  onHeightChange: (height: string) => void;
}

export default function PhysicalDataSelector({
  weight,
  height,
  onWeightChange,
  onHeightChange,
}: PhysicalDataSelectorProps) {
  return (
    <View style={styles.container}>
      {/* Height Input */}
      <View style={styles.inputGroup}>
        <View style={styles.inputRow}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Height"
              placeholderTextColor="#666"
              value={height}
              onChangeText={onHeightChange}
              keyboardType="numeric"
              maxLength={3}
            />
          </View>
          <TouchableOpacity style={styles.unitButton}>
            <Text style={styles.unitText}>cm</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Weight Input */}
      <View style={styles.inputGroup}>
        <View style={styles.inputRow}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Weight"
              placeholderTextColor="#666"
              value={weight}
              onChangeText={onWeightChange}
              keyboardType="numeric"
              maxLength={3}
            />
          </View>
          <TouchableOpacity style={styles.unitButton}>
            <Text style={styles.unitText}>kg</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 20,
    paddingHorizontal: 20,
  },
  inputGroup: {
    width: '100%',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  inputContainer: {
    flex: 1,
  },
  input: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#333',
    borderRadius: 25,
    paddingVertical: 16,
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#fff',
    textAlign: 'left',
  },
  unitButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    minWidth: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
