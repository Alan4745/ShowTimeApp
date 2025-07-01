import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRegistration } from '../context/RegistrationContext';
import ScreenLayout from '../components/common/ScreenLayout';
import ContentContainer from '../components/common/ContentContainer';
import ScreenTitle from '../components/common/ScreenTitle';
import OptionButton from '../components/form/OptionButton';
import BottomSection from '../components/common/BottomSection';
import ContinueButton from '../components/common/ContinueButton';
import HelperText from '../components/common/HelperText';

type Gender = 'Male' | 'Female' | 'Other';

export default function GenderScreen() {
  const navigation = useNavigation();
  const [selectedGender, setSelectedGender] = useState<Gender | null>(null);
  const { updateData } = useRegistration();

  const handleContinue = () => {
    if (!selectedGender) {return;}

    updateData({ gender: selectedGender });
    (navigation as any).navigate('DateOfBirth');
  };

  const genderOptions: Gender[] = ['Female', 'Male', 'Other'];

  return (
    <ScreenLayout currentStep={2} totalSteps={6}>
      <ContentContainer>
        <ScreenTitle title="Gender" />
        <View style={styles.optionsContainer}>
          {genderOptions.map((gender) => (
            <OptionButton
              key={gender}
              title={gender}
              selected={selectedGender === gender}
              onPress={() => setSelectedGender(gender)}
              style={styles.optionButton}
            />
          ))}
        </View>
      </ContentContainer>

      <BottomSection>
        <ContinueButton
          onPress={handleContinue}
          disabled={!selectedGender}
        />
        <HelperText text="It helps us create a training experience that fits you best." />
      </BottomSection>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  optionsContainer: {
    gap: 16,
    alignItems: 'center',
  },
  optionButton: {
    minWidth: 120,
  },
});
