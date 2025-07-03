import React, { useState } from 'react';
import { View, Alert, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRegistration } from '../context/RegistrationContext';
import ScreenLayout from '../components/common/ScreenLayout';
import ContentContainer from '../components/common/ContentContainer';
import ScreenTitle from '../components/common/ScreenTitle';
import PhysicalDataSelector from '../components/form/PhysicalDataSelector';
import QuickSelectGrid from '../components/form/QuickSelectGrid';
import BottomSection from '../components/common/BottomSection';
import ContinueButton from '../components/common/ContinueButton';
import HelperText from '../components/common/HelperText';

export default function PhysicalDataScreen() {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const { updateData } = useRegistration();
  const navigation = useNavigation();

  const handleContinue = () => {
    if (!weight.trim() || !height.trim()) {
      Alert.alert('Error', 'Please enter both weight and height');
      return;
    }

    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);

    if (isNaN(weightNum) || weightNum <= 0 || weightNum > 500) {
      Alert.alert('Error', 'Please enter a valid weight (1-500 kg)');
      return;
    }

    if (isNaN(heightNum) || heightNum <= 0 || heightNum > 300) {
      Alert.alert('Error', 'Please enter a valid height (1-300 cm)');
      return;
    }

    updateData({
      physicalData: {
        weight: weightNum,
        height: heightNum,
      },
    });
    (navigation as any).navigate('PhysicalGoal');
  };

  const quickSelectItems = [
    { label: '70kg / 175cm', value: { weight: '70', height: '175' } },
    { label: '65kg / 165cm', value: { weight: '65', height: '165' } },
  ];

  const handleQuickSelect = (value: { weight: string; height: string }) => {
    setWeight(value.weight);
    setHeight(value.height);
  };

  return (
    <ScreenLayout currentStep={5} totalSteps={6}>
      <ContentContainer>
        <ScreenTitle title="What is your current Height and Weight?" />

        <View style={styles.selectorContainer}>
          <PhysicalDataSelector
            weight={weight}
            height={height}
            onWeightChange={setWeight}
            onHeightChange={setHeight}
          />
        </View>

        <QuickSelectGrid
          title="Quick Select (Demo):"
          items={quickSelectItems}
          onSelect={handleQuickSelect}
          containerStyle={styles.quickSelect}
        />
      </ContentContainer>

      <BottomSection>
        <ContinueButton
          onPress={handleContinue}
          disabled={!weight.trim() || !height.trim()}
        />
        <HelperText text="It helps us create a training experience that fits you best." />
      </BottomSection>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  selectorContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
  quickSelect: {
    marginTop: 20,
  },
});
