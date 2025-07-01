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

type Position = 'Goalkeeper' | 'Defender' | 'Center Back' | 'Fullback' | 'Midfielder' | 'Winger' | 'Forward';

export default function PositionScreen() {
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);
  const { updateData } = useRegistration();
  const navigation = useNavigation();

  const handleContinue = () => {
    if (!selectedPosition) {
      Alert.alert('Error', 'Please select your playing position');
      return;
    }

    updateData({ position: selectedPosition });
    (navigation as any).navigate('ExperienceLevel');
  };

  const positionOptions: Position[] = [
    'Goalkeeper',
    'Defender',
    'Center Back',
    'Fullback',
    'Midfielder',
    'Winger',
    'Forward',
  ];

  const handlePositionSelect = (position: string) => {
    setSelectedPosition(position as Position);
  };

  return (
    <ScreenLayout currentStep={7} totalSteps={9}>
      <ContentContainer>
        <ScreenTitle title="Playing Position" />

        <View style={styles.selectorContainer}>
          <SelectPicker
            label="What position do you play?"
            placeholder="Select your position"
            options={positionOptions}
            selectedValue={selectedPosition}
            onSelect={handlePositionSelect}
          />
        </View>
      </ContentContainer>

      <BottomSection>
        <ContinueButton
          onPress={handleContinue}
          disabled={!selectedPosition}
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
