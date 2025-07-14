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

  return (
    <ScreenLayout currentStep={2} totalSteps={6}>
      <ContentContainer>
        <ScreenTitle title="Gender" />
        <View style={styles.optionsContainer}>
          {/* Top row: Female and Male */}
          <View style={styles.topRow}>
            <OptionButton
              title="Female"
              selected={selectedGender === 'Female'}
              onPress={() => setSelectedGender('Female')}
              style={styles.parallelButton}
            />
            <OptionButton
              title="Male"
              selected={selectedGender === 'Male'}
              onPress={() => setSelectedGender('Male')}
              style={styles.parallelButton}
            />
          </View>

          {/* Bottom row: Other (centered) */}
          <View style={styles.bottomRow}>
            <OptionButton
              title="Other"
              selected={selectedGender === 'Other'}
              onPress={() => setSelectedGender('Other')}
              style={styles.centerButton}
            />
          </View>
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
    width: '100%',
  },
  topRow: {
    flexDirection: 'row',
    gap: 16,
    width: '100%',
    justifyContent: 'space-between',
  },
  bottomRow: {
    width: '100%',
    alignItems: 'center',
  },
  parallelButton: {
    flex: 1,
    minWidth: 0, // Allow flex to work properly
  },
  centerButton: {
    width: '48%', // Same width as each parallel button
  },
});
