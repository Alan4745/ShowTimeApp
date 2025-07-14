import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from  '@react-navigation/native';
import { RegistrationData, useRegistration } from '../context/RegistrationContext';
import ScreenLayout from '../components/common/ScreenLayout';
import ContentContainer from '../components/common/ContentContainer';
import ScreenTitle from '../components/common/ScreenTitle';
import ToggleButton from '../components/form/ToggleButton';
import BottomSection from '../components/common/BottomSection';
import ContinueButton from '../components/common/ContinueButton';
import HelperText from '../components/common/HelperText';

export default function NotificationsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean | null>(null);
  const { updateData } = useRegistration();
  const navigation = useNavigation();

  const handleContinue = () => {
    updateData({ notificationsEnabled: notificationsEnabled } as RegistrationData);
    (navigation as any).navigate('PlanSelection');
  };

  const handleToggleSelect = (option: string) => {
    setNotificationsEnabled(option === 'Yes');
  };

  return (
    <ScreenLayout currentStep={11} totalSteps={14}>
      <ContentContainer>
        <ScreenTitle title="Enable notifications" />

        <View style={styles.toggleContainer}>
          <ToggleButton
            leftOption="No"
            rightOption="Yes"
            selectedOption={notificationsEnabled === null ? null : notificationsEnabled ? 'Yes' : 'No'}
            onSelect={handleToggleSelect}
          />
        </View>
      </ContentContainer>

      <BottomSection>
        <ContinueButton
          onPress={handleContinue}
          disabled={notificationsEnabled === null}
        />
        <HelperText text="It helps us create a training experience that fits you best." />
      </BottomSection>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  toggleContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
});
