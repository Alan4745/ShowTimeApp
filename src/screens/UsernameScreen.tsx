import React, {useState} from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {useRegistration} from '../context/RegistrationContext';
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
import {fetchWithTimeout} from '../utils/fetchWithTimeout';

export default function UsernameScreen() {
  const navigation = useNavigation();
  const {t} = useTranslation();
  const insets = useSafeAreaInsets();
  const {data, updateData} = useRegistration();
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
      body: JSON.stringify({username: trimmedUsername}),
    });

    const json = await response.json();

    if (!response.ok) {
      showAlert(t('errors.usernameCheckFailed'));
      setCheckingAvailability(false);
      return;
    }

    if (!json.usernameAvailable) {
      showAlert(t('errors.usernameTaken'));
      setCheckingAvailability(false);
      return;
    }

    // Si el username está disponible
    updateData({username: trimmedUsername});
    (navigation as any).navigate('Gender');
    setCheckingAvailability(false);
  };

  const keyboardOffset = Platform.OS === 'ios' ? insets.top + 44 : 0;

  return (
    <ScreenLayout currentStep={2} totalSteps={totalSteps}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoiding}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={keyboardOffset}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="interactive">
            <ContentContainer>
              <ScreenTitle title={t('registration.username')} />
              <FormInput
                placeholder={t('placeholders.chooseUsername')}
                value={username}
                onChangeText={handleUsernameChange}
                autoCapitalize="none"
                autoCorrect={false}
                inputStyle={styles.inputCentered}
                error={error}
              />
            </ContentContainer>
          </ScrollView>
        </TouchableWithoutFeedback>

        <BottomSection>
          {checkingAvailability ? (
            <LottieIcon source={loadingAnimation} size={48} loop autoPlay />
          ) : (
            <ContinueButton
              onPress={handleContinue}
              disabled={!username.trim()}
            />
          )}
          <HelperText text={t('helperTexts.helperText')} />
        </BottomSection>
      </KeyboardAvoidingView>

      <PopupAlert
        visible={alertVisible}
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
      />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  keyboardAvoiding: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  inputCentered: {
    textAlign: 'center',
  },
});
