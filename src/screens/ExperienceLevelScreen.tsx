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
import DropdownModal from '../components/modals/DropdownModal';
import { ChevronDown } from 'lucide-react-native';

type ExperienceLevel = 'High School' | 'Academy' | 'College' | 'Semi-Pro' | 'Lower division Pro';

export default function ExperienceLevelScreen() {
  const [selectedLevel, setSelectedLevel] = useState<ExperienceLevel | null>(null);
  const [showModal, setShowModal] = useState(false);
  const { updateData } = useRegistration();
  const navigation = useNavigation();

  const handleContinue = () => {
    if (!selectedLevel) {
      Alert.alert('Error', 'Please select your experience level');
      return;
    }

    updateData({ experienceLevel: selectedLevel });
    (navigation as any).navigate('TrainingFrequency');
  };

  const experienceLevels: ExperienceLevel[] = [
    'High School',
    'Academy',
    'College',
    'Semi-Pro',
    'Lower division Pro',
  ];

  const handleLevelSelect = (level: string) => {
    setSelectedLevel(level as ExperienceLevel);
    setShowModal(false);
  };

  return (
    <ScreenLayout currentStep={8} totalSteps={12}>
      <ContentContainer>
        <ScreenTitle title="Experience Level" />

        <View style={styles.selectorContainer}>
          <TouchableOpacity
            style={[
              styles.levelSelector,
              selectedLevel && styles.selectedLevelSelector,
            ]}
            onPress={() => setShowModal(true)}
          >
            <Text style={[
              styles.levelSelectorText,
              selectedLevel && styles.selectedLevelSelectorText,
            ]}>
              {selectedLevel || 'Select your level'}
            </Text>
            <ChevronDown color={selectedLevel ? '#4A90E2' : '#666'} size={20} />
          </TouchableOpacity>
        </View>
      </ContentContainer>

      <BottomSection>
        <ContinueButton
          onPress={handleContinue}
          disabled={!selectedLevel}
        />
        <HelperText text="It helps us create a training experience that fits you best." />
      </BottomSection>

      <DropdownModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        title="Select Experience Level"
        items={experienceLevels}
        onSelect={handleLevelSelect}
        renderItem={(item) => item}
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
  selectedLevelSelector: {
    borderColor: '#4A90E2',
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
  },
  levelSelectorText: {
    fontFamily: 'AnonymousPro-Regular',
    fontWeight: '400',
    lineHeight: 20,
    color: '#666',
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
  },
  selectedLevelSelectorText: {
    color: '#fff',
  },
});
