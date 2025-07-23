import React, { useState } from 'react';
import { View, Alert, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRegistration } from '../context/RegistrationContext';
import ScreenLayout from '../components/common/ScreenLayout';
import ContentContainer from '../components/common/ContentContainer';
import ScreenTitle from '../components/common/ScreenTitle';
import BottomSection from '../components/common/BottomSection';
import ContinueButton from '../components/common/ContinueButton';
import HelperText from '../components/common/HelperText';
import { ChevronDown } from 'lucide-react-native';
import DropdownModal from '../components/modals/DropdownModal';
import { useTranslation } from 'react-i18next';

type TrainingFrequency = 'sessions3to5' | 'sessions5to7' | 'sessionsPlus7';

export default function TrainingFrequencyScreen() {
  const [selectedFrequency, setSelectedFrequency] = useState<TrainingFrequency | null>(null);
  const [showModal, setShowModal] = useState(false);
  const { updateData } = useRegistration();
  const navigation = useNavigation();
  const { t } = useTranslation();

  // Mapeo para guardar el valor compatible con RegistrationContext y traducido para mostrar
  const frequencyOptions: { key: TrainingFrequency; label: string; }[] = [
    { key: 'sessions3to5', label: t('trainingFrequencies.sessions3to5') },
    { key: 'sessions5to7', label: t('trainingFrequencies.sessions5to7') },
    { key: 'sessionsPlus7', label: t('trainingFrequencies.sessionsPlus7') },
  ];

  const handleContinue = () => {
    if (!selectedFrequency) {
      Alert.alert(t('errors.selectTrainingFrequency'), t('errors.selectTrainingFrequency'));
      return;
    }
    // Guardamos la clave interna que usas en el contexto
    const frequencyMap = {
      sessions3to5: '3-5 sessions per week',
      sessions5to7: '5-7 sessions per week',
      sessionsPlus7: '+7 sessions per week',
    };
    updateData({ trainingFrequency: frequencyMap[selectedFrequency] as any });
    (navigation as any).navigate('ContentLikes');
  };

  const handleFrequencySelect = (frequencyKey: TrainingFrequency) => {
    setSelectedFrequency(frequencyKey);
    setShowModal(false);
  };

  return (
    <ScreenLayout currentStep={9} totalSteps={12}>
      <ContentContainer>
        <ScreenTitle title={t('registration.trainingFrequency')} />

        <View style={styles.selectorContainer}>
          <TouchableOpacity
            style={[
              styles.frequencySelector,
              selectedFrequency && styles.selectedFrequencySelector,
            ]}
            onPress={() => setShowModal(true)}
          >
            <Text
              style={[
                styles.frequencySelectorText,
                selectedFrequency && styles.selectedFrequencySelectorText,
              ]}
            >
              {selectedFrequency ? t(`trainingFrequencies.${selectedFrequency}`) : t('placeholders.selectFrequency')}
            </Text>
            <ChevronDown color={selectedFrequency ? '#4A90E2' : '#666'} size={20} />
          </TouchableOpacity>
        </View>
      </ContentContainer>

      <BottomSection>
        <ContinueButton onPress={handleContinue} disabled={!selectedFrequency} />
        <HelperText text={t('helperTexts.helperText')} />
      </BottomSection>

      <DropdownModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        title={t('modalTitles.selectTrainingFrequencyTitle')}
        items={frequencyOptions.map(opt => opt.key)}
        onSelect={handleFrequencySelect}
        renderItem={(item) => t(`trainingFrequencies.${item}`)}
      />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  selectorContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  frequencySelector: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#333',
    borderRadius: 25,
    paddingVertical: 16,
    paddingHorizontal: 20,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectedFrequencySelector: {
    borderColor: '#4A90E2',
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
  },
  frequencySelectorText: {
    fontFamily: 'AnonymousPro-Regular',
    fontWeight: '400',
    lineHeight: 20,
    color: '#666',
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
  },
  selectedFrequencySelectorText: {
    color: '#fff',
  },
});
