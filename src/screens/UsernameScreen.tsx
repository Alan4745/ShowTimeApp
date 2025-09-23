import React, { useState } from 'react';
import { Alert, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useRegistration } from '../context/RegistrationContext';
import ScreenLayout from '../components/common/ScreenLayout';
import ContentContainer from '../components/common/ContentContainer';
import ScreenTitle from '../components/common/ScreenTitle';
import FormInput from '../components/form/FormInput';
import BottomSection from '../components/common/BottomSection';
import ContinueButton from '../components/common/ContinueButton';
import HelperText from '../components/common/HelperText';

export default function UsernameScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const { data, updateData } = useRegistration();
  const isCoach = data.role === "coach";
  const totalSteps = isCoach ? 9 : 13;

  const handleContinue = () => {

    if (!username.trim()) {
      Alert.alert(t('errors.usernameRequired'));
      return;
    }

    if (username.length < 3) {
      Alert.alert(t('errors.usernameTooShort'));
      return;
    }

    updateData({ username: username.trim() });
    (navigation as any).navigate('Gender');
  };

  return (
    <ScreenLayout currentStep={2} totalSteps={totalSteps}>
      <ContentContainer>        
        <ScreenTitle title={t('registration.username')} />
        <FormInput
          placeholder={t('placeholders.chooseUsername')}
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          autoCorrect={false}
          inputStyle={{ textAlign: 'center' }}
        />
      </ContentContainer>

      <BottomSection >
        <ContinueButton
          onPress={handleContinue}
          disabled={!username.trim()}
        />
        <HelperText text={t('helperTexts.helperText')}/>
      </BottomSection>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
   
});

