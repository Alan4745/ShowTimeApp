import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RegistrationData, useRegistration } from '../context/RegistrationContext';
import ScreenLayout from '../components/common/ScreenLayout';
import ContentContainer from '../components/common/ContentContainer';
import ScreenTitle from '../components/common/ScreenTitle';
//import ToggleButton from '../components/form/ToggleButton';
import BottomSection from '../components/common/BottomSection';
import ContinueButton from '../components/common/ContinueButton';
import HelperText from '../components/common/HelperText';
import DualButtonSelector from '../components/form/DualButtonSelector';
import { useTranslation } from 'react-i18next';

export default function NotificationsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean | null>(null);
  const { updateData } = useRegistration();
  const navigation = useNavigation();
  const { t } = useTranslation();

  const handleContinue = () => {
    updateData({ notificationsEnabled: notificationsEnabled } as RegistrationData);
    (navigation as any).navigate('PlanSelection');
  };

  const handleToggleSelect = (option: string) => {
    setNotificationsEnabled(option === t('common.yes'));
  };

  return (
    <ScreenLayout currentStep={11} totalSteps={14}>
      <ContentContainer>
        <ScreenTitle title={t('registration.notifications')} />

        <View style={styles.toggleContainer}>
          {/* <ToggleButton
            leftOption={t('common.no')}
            rightOption={t('common.yes')}
            selectedOption={
              notificationsEnabled === null
                ? null
                : notificationsEnabled
                ? t('common.yes')
                : t('common.no')
            }
            onSelect={handleToggleSelect}
          /> */}
          <DualButtonSelector
            leftOption={t('common.no')}
            rightOption={t('common.yes')}
            selectedOption={
              notificationsEnabled === null
                ? null
                : notificationsEnabled
                ? t('common.yes')
                : t('common.no')
            }
            onSelect={handleToggleSelect}
          />  
        </View>
      </ContentContainer>

      <BottomSection>
        <ContinueButton
          onPress={handleContinue}
          disabled={notificationsEnabled === null}
        />
        <HelperText text={t('helperTexts.helperText')} />
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
