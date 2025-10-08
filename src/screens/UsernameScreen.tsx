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
import PopupAlert from '../components/modals/PopupAlert';
import LottieIcon from '../components/common/LottieIcon';
import loadingAnimation from '../../assets/lottie/loading.json';
import API_BASE_URL from '../config/api';

export default function UsernameScreen() {
  const endpoint = `${API_BASE_URL}/api/auth/check-availability`;
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const { data, updateData } = useRegistration();
  const isCoach = data.role === "coach";
  const totalSteps = isCoach ? 9 : 13;
  const [error, setError] = useState('');
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const showAlert = (message: string) => {
    setAlertMessage(message);
    setAlertVisible(true);
  };

  
  const handleUsernameChange = (text: string) => {
    setUsername(text);
    setError(''); // Limpia errores anteriores

    const trimmed = text.trim();

    // Validación visual de largo mínimo
    if (trimmed.length > 0 && trimmed.length < 3) {
      setError(t('errors.usernameTooShort'));
    }     
  };

  const handleContinue = async () => {
    if (!username.trim()) {
      Alert.alert(t('errors.usernameRequired'));
      return;
    }

    if (username.length < 3) {
      Alert.alert(t('errors.usernameTooShort'));
      return;
    }

    try {
      setCheckingAvailability(true);

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        showAlert(t('errors.usernameCheckFailed') || 'Error checking username');
        return;
      }

      if (!data.usernameAvailable) {
        showAlert(t('errors.usernameTaken') || 'Username is already taken');
        return;
      }

      // Si todo OK
      updateData({ username: username.trim() });
      (navigation as any).navigate('Gender');

    } catch (e) {
      console.error('Error checking username availability:', e);
      showAlert(t('errors.networkError') || 'Network error. Please try again.');
    } finally {
      setCheckingAvailability(false);
    }
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

      <BottomSection >
        {checkingAvailability ? (
          <LottieIcon source={loadingAnimation} size={48} loop autoPlay />
        ) : (
          <ContinueButton onPress={handleContinue} disabled={!username.trim()} />
        )}
        <HelperText text={t('helperTexts.helperText')}/>
      </BottomSection>
      <PopupAlert
        visible={alertVisible}
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
      />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
   
});

