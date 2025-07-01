import React, { useState, useEffect } from 'react';
import { View, Alert, StyleSheet } from 'react-native';
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

export default function CreateAccountScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [touched, setTouched] = useState({
    email: false,
    password: false,
    confirmPassword: false,
  });
  const { updateData } = useRegistration();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  // Real-time validation
  useEffect(() => {
    const newErrors = { ...errors };

    // Email validation
    if (touched.email) {
      if (!email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!validateEmail(email)) {
        newErrors.email = 'Please enter a valid email address';
      } else {
        newErrors.email = '';
      }
    }

    // Password validation
    if (touched.password) {
      if (!password.trim()) {
        newErrors.password = 'Password is required';
      } else if (!validatePassword(password)) {
        newErrors.password = 'Password must be at least 8 characters long';
      } else {
        newErrors.password = '';
      }
    }

    // Confirm password validation
    if (touched.confirmPassword) {
      if (!confirmPassword.trim()) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (password !== confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      } else {
        newErrors.confirmPassword = '';
      }
    }

    setErrors(newErrors);
  }, [email, password, confirmPassword, touched]);

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (!touched.email) {
      setTouched(prev => ({ ...prev, email: true }));
    }
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (!touched.password) {
      setTouched(prev => ({ ...prev, password: true }));
    }
  };

  const handleConfirmPasswordChange = (text: string) => {
    setConfirmPassword(text);
    if (!touched.confirmPassword) {
      setTouched(prev => ({ ...prev, confirmPassword: true }));
    }
  };

  const handleContinue = () => {
    // Mark all fields as touched to show any remaining errors
    setTouched({
      email: true,
      password: true,
      confirmPassword: true,
    });

    // Check if there are any errors
    const hasErrors = Object.values(errors).some(error => error !== '') ||
                     !email.trim() || !password.trim() || !confirmPassword.trim();

    if (hasErrors) {
      Alert.alert('Error', 'Please fix the errors above before continuing');
      return;
    }

    updateData({
      authMethod: 'email',
      email: email.trim(),
      password: password,
    });

    (navigation.navigate as any)({ name: 'Username' });
  };

  const isFormValid = email.trim() &&
                     password.trim() &&
                     confirmPassword.trim() &&
                     !errors.email &&
                     !errors.password &&
                     !errors.confirmPassword;

  return (
    <ScreenLayout currentStep={0} totalSteps={6}>
      <ContentContainer>
        <ScreenTitle title="Create your account" />

        <View style={styles.formContainer}>
          <FormInput
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={handleEmailChange}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            error={touched.email ? errors.email : ''}
          />

          <PasswordInput
            label="Password"
            placeholder="Create a password"
            value={password}
            onChangeText={handlePasswordChange}
            error={touched.password ? errors.password : ''}
          />

          <PasswordInput
            label="Confirm Password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChangeText={handleConfirmPasswordChange}
            error={touched.confirmPassword ? errors.confirmPassword : ''}
          />

          <HelperText
            text="Password must be at least 8 characters long"
            style={styles.passwordRequirements}
          />
        </View>
      </ContentContainer>

      <BottomSection>
        <ContinueButton
          onPress={handleContinue}
          disabled={!isFormValid}
        />

        <View style={styles.termsContainer}>
          <HelperText text="By creating an account, you agree to our Terms of Service and Privacy Policy" />
        </View>
      </BottomSection>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    gap: 24,
  },
  passwordRequirements: {
    marginTop: -8,
    textAlign: 'left',
    paddingHorizontal: 4,
  },
  termsContainer: {
    paddingHorizontal: 20,
  },
});
