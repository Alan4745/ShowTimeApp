import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
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
import PopupAlert from '../components/modals/PopupAlert';
import LottieIcon from '../components/common/LottieIcon';
import loadingAnimation from '../../assets/lottie/loading.json';
import { fetchWithTimeout } from '../utils/fetchWithTimeout';

export default function UsernameScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { data, updateData } = useRegistration();
  const isCoach = data.role === 'coach';
  const totalSteps = isCoach ? 9 : 13;  
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const endpoint = '/api/auth/check-availability';
  
  const showAlert = (message: string) => {
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const handleUsernameChange = (text: string) => {
    setUsername(text);
    setError('');

    const trimmed = text.trim();
    if (trimmed.length > 0 && trimmed.length < 3) {
      setError(t('errors.usernameTooShort'));
    }
  };

  const handleContinue = async () => {
    const trimmedUsername = username.trim();

    if (!trimmedUsername) {
      showAlert(t('errors.usernameRequired'));
      return;
    }

    if (trimmedUsername.length < 3) {
      showAlert(t('errors.usernameTooShort'));
      return;
    }

    setCheckingAvailability(true);

    // No necesitas try/catch aquí los maneja fetchWithTimeout
    const response = await fetchWithTimeout(endpoint, {
      method: 'POST',
      body: JSON.stringify({ username: trimmedUsername }),
    });

    const data = await response.json();

    if (!response.ok) {
      showAlert(t('errors.usernameCheckFailed'));
      setCheckingAvailability(false);
      return;
    }

    if (!data.usernameAvailable) {
      showAlert(t('errors.usernameTaken'));
      setCheckingAvailability(false);
      return;
    }

    // Si el username está disponible
    updateData({ username: trimmedUsername });
    (navigation as any).navigate('Gender');
    setCheckingAvailability(false);      
  };

  return (
    <ScreenLayout currentStep={2} totalSteps={totalSteps}>
      <ContentContainer>
        <ScreenTitle title={t('registration.username')} />
        <FormInput
          placeholder={t('placeholders.chooseUsername')}
          value={username}
          onChangeText={handleUsernameChange}
          autoCapitalize="none"
          autoCorrect={false}
          inputStyle={{ textAlign: 'center' }}
          error={error}
        />
      </ContentContainer>

      <BottomSection>
        {checkingAvailability ? (
          <LottieIcon source={loadingAnimation} size={48} loop autoPlay />
        ) : (
          <ContinueButton onPress={handleContinue} disabled={!username.trim()} />
        )}
        <HelperText text={t('helperTexts.helperText')} />
      </BottomSection>

      <PopupAlert
        visible={alertVisible}
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
      />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({});
