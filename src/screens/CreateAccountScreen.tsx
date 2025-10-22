import React, { useState, useEffect } from 'react';
import {View, Alert, StyleSheet, KeyboardAvoidingView, ScrollView, TouchableWithoutFeedback,
  Keyboard, Platform} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRegistration } from '../context/RegistrationContext';
import ScreenLayout from '../components/common/ScreenLayout';
import ContentContainer from '../components/common/ContentContainer';
import ScreenTitle from '../components/common/ScreenTitle';
import FormInput from '../components/form/FormInput';
import PasswordInput from '../components/form/PasswordInput';
import BottomSection from '../components/common/BottomSection';
import ContinueButton from '../components/common/ContinueButton';
import HelperText from '../components/common/HelperText';
import { useTranslation } from 'react-i18next';
import LottieIcon from '../components/common/LottieIcon';
import loadingAnimation from '../../assets/lottie/loading.json'; 
import { fetchWithTimeout } from '../utils/fetchWithTimeout';

export default function CreateAccountScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { updateData } = useRegistration();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '', confirmPassword: '' });
  const [touched, setTouched] = useState({ email: false, password: false, confirmPassword: false });

  const [loading, setLoading] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const endpoint = '/api/auth/check-availability';

  const validateEmail = (email: string) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  const validatePassword = (password: string) => password.length >= 8;

  // Validate fields on change
  useEffect(() => {
    const newErrors = { ...errors };

    if (touched.email) {
      if (!email.trim()) newErrors.email = t('errors.emailRequired');
      else if (!validateEmail(email)) newErrors.email = t('errors.invalidEmail');
      else newErrors.email = '';
    }

    if (touched.password) {
      if (!password.trim()) newErrors.password = t('errors.passwordRequired');
      else if (!validatePassword(password)) newErrors.password = t('errors.passwordTooShort');
      else newErrors.password = '';
    }

    if (touched.confirmPassword) {
      if (!confirmPassword.trim()) newErrors.confirmPassword = t('errors.confirmPasswordRequired');
      else if (password !== confirmPassword) newErrors.confirmPassword = t('errors.passwordsNotMatch');
      else newErrors.confirmPassword = '';
    }

    setErrors(newErrors);
  }, [email, password, confirmPassword, touched, t]);

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (!touched.email) setTouched(prev => ({ ...prev, email: true }));
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (!touched.password) setTouched(prev => ({ ...prev, password: true }));
  };

  const handleConfirmPasswordChange = (text: string) => {
    setConfirmPassword(text);
    if (!touched.confirmPassword) setTouched(prev => ({ ...prev, confirmPassword: true }));
  };

  const handleContinue = async () => {
    Keyboard.dismiss();
    setTouched({ email: true, password: true, confirmPassword: true });

    const hasErrors =
      Object.values(errors).some(error => error !== '') ||
      !email.trim() ||
      !password.trim() ||
      !confirmPassword.trim();

    if (hasErrors) {
      Alert.alert(t('common.error'), t('errors.fixErrors'));
      return;
    }

    setLoading(true);

    try {
      const response = await fetchWithTimeout(endpoint, {
        method: 'POST',        
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      const data = await response.json();

      if (!data.emailAvailable) {
        setErrors(prev => ({ ...prev, email: t('errors.emailTaken') }));
        setLoading(false);
        return;
      }

      // Save registration data
      updateData({
        authMethod: 'email',
        email: email.trim(),
        password: password,
      });

      (navigation.navigate as any)({ name: 'SelectRole' });
    } finally {
      setLoading(false);
    }
  };

  const isFormValid =
    email.trim() &&
    password.trim() &&
    confirmPassword.trim() &&
    !errors.email &&
    !errors.password &&
    !errors.confirmPassword;

  return (
    <ScreenLayout currentStep={0} totalSteps={6}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
            <ContentContainer>
              <ScreenTitle title={t('registration.createAccount')} />

              <View style={styles.formContainer}>
                <FormInput
                  label={t('registration.email')}
                  placeholder={t('placeholders.enterEmail')}
                  value={email}
                  onChangeText={handleEmailChange}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  error={touched.email ? errors.email : ''}
                />

                <PasswordInput
                  label={t('registration.password')}
                  placeholder={t('placeholders.createPassword')}
                  value={password}
                  onChangeText={handlePasswordChange}
                  error={touched.password ? errors.password : ''}
                />

                <PasswordInput
                  label={t('registration.confirmPassword')}
                  placeholder={t('placeholders.confirmYourPassword')}
                  value={confirmPassword}
                  onChangeText={handleConfirmPasswordChange}
                  error={touched.confirmPassword ? errors.confirmPassword : ''}
                />

                <HelperText
                  text={t('helperTexts.passwordRequirement')}
                  style={styles.passwordRequirements}
                />
              </View>
            </ContentContainer>
          </ScrollView>
        </TouchableWithoutFeedback>

        <BottomSection>
          {loading ? (
            <LottieIcon source={loadingAnimation} size={48} loop />
          ) : (
            <ContinueButton onPress={handleContinue} disabled={!isFormValid} />
          )}

          <View style={styles.termsContainer}>
            <HelperText text={t('helperTexts.termsText')} />
          </View>
        </BottomSection>        
      </KeyboardAvoidingView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    gap: 16,
    marginTop: 16,
  },
  passwordRequirements: {
    marginTop: 8,
  },
  termsContainer: {
    marginTop: 12,
  },
});
