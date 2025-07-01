import React, { useState } from 'react';
import { View, Alert, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRegistration } from '../context/RegistrationContext';
import ScreenLayout from '../components/common/ScreenLayout';
import ContentContainer from '../components/common/ContentContainer';
import ScreenTitle from '../components/common/ScreenTitle';
import SelectPicker from '../components/form/SelectPicker';
import BottomSection from '../components/common/BottomSection';
import ContinueButton from '../components/common/ContinueButton';
import HelperText from '../components/common/HelperText';

type ExperienceLevel = 'High School' | 'Academy' | 'College' | 'Semi-Pro' | 'Lower division Pro';

export default function ExperienceLevelScreen() {
  const [selectedLevel, setSelectedLevel] = useState<ExperienceLevel | null>(null);
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
  };

  return (
    <ScreenLayout currentStep={8} totalSteps={9}>
      <ContentContainer>
        <ScreenTitle title="Experience Level" />

        <View style={styles.selectorContainer}>
          <SelectPicker
            label="What's your experience level?"
            placeholder="Select your level"
            options={experienceLevels}
            selectedValue={selectedLevel}
            onSelect={handleLevelSelect}
          />
        </View>
      </ContentContainer>

      <BottomSection>
        <ContinueButton
          onPress={handleContinue}
          disabled={!selectedLevel}
        />
        <HelperText text="It helps us create a training experience that fits you best." />
      </BottomSection>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  selectorContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
});
