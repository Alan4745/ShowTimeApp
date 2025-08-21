import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
{/* Weight Input */}
      <View style={styles.inputGroup}>
        <View style={styles.inputRow}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder={t('weight')}
              placeholderTextColor="#666"
              value={weight}
              onChangeText={onWeightChange}
              keyboardType="numeric"
              maxLength={3}
            />
          </View>
          <TouchableOpacity style={styles.unitButton}>
            <Text style={styles.unitText}>{t('units.lb')}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Height Input */}
      <View style={styles.inputGroup}>
        <View style={styles.inputRow}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder={t('height')}
              placeholderTextColor="#929292"
              value={height}
              onChangeText={onHeightChange}
              keyboardType="numeric"
              maxLength={3}
            />
          </View>
          <TouchableOpacity style={styles.unitButton}>
            <Text style={styles.unitText}>{t('units.ft')}</Text>
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
    borderWidth: 1,
    borderColor: '#FFFFFF',
    borderRadius: 25,
    paddingVertical: 11,
    paddingHorizontal: 20,
    fontSize: 20,
    fontWeight: "400",
    color: '#FFFFFF',
    textAlign: 'center',
  },
  unitButton: {
    backgroundColor: '#2B80BE',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    minWidth: 110,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unitText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '400',
  },
});

