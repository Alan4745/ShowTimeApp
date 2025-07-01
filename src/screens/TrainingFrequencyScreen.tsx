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

type TrainingFrequency = '3-5 sessions per week' | '5-7 sessions per week' | '+7 sessions per week';

export default function TrainingFrequencyScreen() {
  const [selectedFrequency, setSelectedFrequency] = useState<TrainingFrequency | null>(null);
  const { updateData } = useRegistration();
  const navigattion = useNavigation();

  const handleContinue = () => {
    if (!selectedFrequency) {
      Alert.alert('Error', 'Please select your training frequency');
      return;
    }

    updateData({ trainingFrequency: selectedFrequency });
    (navigattion as any).navigate('ContentLikes');
  };

  const frequencyOptions: TrainingFrequency[] = [
    '3-5 sessions per week',
    '5-7 sessions per week',
    '+7 sessions per week',
  ];

  const handleFrequencySelect = (frequency: string) => {
    setSelectedFrequency(frequency as TrainingFrequency);
  };

  return (
    <ScreenLayout currentStep={9} totalSteps={12}>
      <ContentContainer>
        <ScreenTitle title="Training Frequency" />

        <View style={styles.selectorContainer}>
          <SelectPicker
            label="How often do you train?"
            placeholder="Select training frequency"
            options={frequencyOptions}
            selectedValue={selectedFrequency}
            onSelect={handleFrequencySelect}
          />
        </View>
      </ContentContainer>

      <BottomSection>
        <ContinueButton
          onPress={handleContinue}
          disabled={!selectedFrequency}
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
