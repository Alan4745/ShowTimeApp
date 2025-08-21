import React, { useState } from 'react';
import { View, Alert, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRegistration, RegistrationData } from '../context/RegistrationContext';  // <--- Aquí importa RegistrationData
import { useTranslation } from 'react-i18next';
import ScreenLayout from '../components/common/ScreenLayout';
import ContentContainer from '../components/common/ContentContainer';
import ScreenTitle from '../components/common/ScreenTitle';
import BottomSection from '../components/common/BottomSection';
import ContinueButton from '../components/common/ContinueButton';
import HelperText from '../components/common/HelperText';
import DropdownModal from '../components/modals/DropdownModal';
import { ChevronDown } from 'lucide-react-native';

// Define el tipo usando las claves internas (que coinciden con las keys de tu JSON)
type ExperienceLevel =
  | 'highSchool'
  | 'academy'
  | 'college'
  | 'semiPro'
  | 'lowerDivisionPro';

export default function ExperienceLevelScreen() {
  const { t } = useTranslation();
  const [selectedLevel, setSelectedLevel] = useState<ExperienceLevel | null>(null);
  const [showModal, setShowModal] = useState(false);
  const { updateData } = useRegistration();
  const navigation = useNavigation();

  const handleContinue = () => {
    if (!selectedLevel) {
      Alert.alert(t('errors.selectExperienceLevel'), t('errors.selectExperienceLevel'));
      return;
    }

    // Aquí guardamos el valor traducido a las opciones internas para RegistrationData
    // Si tu RegistrationData usa los valores "High School", "Academy" etc, mapea aquí
    const mapToRegistrationValue: Record<ExperienceLevel, RegistrationData['experienceLevel']> = {
      highSchool: 'High School',
      academy: 'Academy',
      college: 'College',
      semiPro: 'Semi-Pro',
      lowerDivisionPro: 'Lower division Pro',
    };

    updateData({ experienceLevel: mapToRegistrationValue[selectedLevel] });
    (navigation as any).navigate('TrainingFrequency');
  };

  const experienceLevels: ExperienceLevel[] = [
    'highSchool',
    'academy',
    'college',
    'semiPro',
    'lowerDivisionPro',
  ];

  const handleLevelSelect = (level: ExperienceLevel) => {
    setSelectedLevel(level);
    setShowModal(false);
  };

  return (
    <ScreenLayout currentStep={8} totalSteps={12}>
      <ContentContainer>
        <ScreenTitle title={t('registration.experienceLevel')} />

        <View style={styles.selectorContainer}>
          <TouchableOpacity
            style={[
              styles.levelSelector,
              selectedLevel && styles.selectedLevelSelector,
            ]}
            onPress={() => setShowModal(true)}
          >
            <Text
              style={[
                styles.levelSelectorText,
                selectedLevel && styles.selectedLevelSelectorText,
              ]}
            >
              {selectedLevel ? t(`experienceLevels.${selectedLevel}`) : t('errors.selectExperienceLevel')}
            </Text>
            <ChevronDown color={selectedLevel ? '#FFFFFF' : '#929292'} size={20} />
          </TouchableOpacity>
        </View>
      </ContentContainer>

      <BottomSection>
        <ContinueButton onPress={handleContinue} disabled={!selectedLevel} />
        <HelperText text={t('helperTexts.helperText')} />
      </BottomSection>

      <DropdownModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        title={t('modalTitles.selectExperienceLevelTitle')}
        items={experienceLevels}
        onSelect={handleLevelSelect}
        renderItem={(item) => t(`experienceLevels.${item}`)}
      />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  selectorContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  levelSelector: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#FFFFFF',
    borderRadius: 25,
    paddingVertical: 16,
    paddingHorizontal: 20,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectedLevelSelector: {
    borderColor: '#2B80BE',
    backgroundColor: '#2B80BE',
  },
  levelSelectorText: {
    fontFamily: 'AnonymousPro-Regular',
    fontWeight: '400',
    lineHeight: 20,
    color: '#929292',
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
  },
  selectedLevelSelectorText: {
    color: '#FFFFFF',
  },
});
