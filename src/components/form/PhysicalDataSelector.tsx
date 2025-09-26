import React, {useState, useEffect} from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet} from 'react-native';
import { useTranslation } from 'react-i18next';

interface PhysicalDataSelectorProps {
  weight: string;
  height: string;
  onWeightChange: (weight: string) => void;
  onHeightChange: (height: string) => void;
  onUnitWeightChange: (unit: string) => void;
  onUnitHeightChange: (unit: string) => void;
}

export default function PhysicalDataSelector({
  weight,
  height,
  onWeightChange,
  onHeightChange,
  onUnitWeightChange,
  onUnitHeightChange,
}: PhysicalDataSelectorProps) {
  const { t, i18n } = useTranslation();
  const [unitWeight, setUnitWeight] = useState('');
  const [unitHeight, setUnitHeight] = useState('');

    // Detectar idioma y asignar unidades correspondientes
  useEffect(() => {
    if (i18n.language === 'es') {
      setUnitWeight('kg');
      setUnitHeight('cm');
      onUnitWeightChange('kg');
      onUnitHeightChange('cm');
    } else {
      setUnitWeight('lb');
      setUnitHeight('ft');
      onUnitWeightChange('lb');
      onUnitHeightChange('ft');
    }
  }, [i18n.language]);

  return (
    <View style={styles.container}>
      {/* Weight Input */}
      <View style={styles.inputGroup}>
        <View style={styles.inputRow}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder={t('summary.weight')}
              placeholderTextColor="#666"
              value={weight}
              onChangeText={onWeightChange}
              keyboardType="numeric"
              maxLength={3}
            />
          </View>
          <TouchableOpacity style={styles.unitButton}>
            <Text style={styles.unitText}>{t(`units.${unitWeight}`)}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Height Input */}
      <View style={styles.inputGroup}>
        <View style={styles.inputRow}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder={t('summary.height')}
              placeholderTextColor="#929292"
              value={height}
              onChangeText={onHeightChange}
              keyboardType="numeric"
              maxLength={3}
            />
          </View>
          <TouchableOpacity style={styles.unitButton}>
            <Text style={styles.unitText}>{t(`units.${unitHeight}`)}</Text>
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

