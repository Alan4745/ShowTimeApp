import { useNavigation } from '@react-navigation/native';
import { View, StyleSheet, StatusBar, SafeAreaView } from 'react-native';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import BottomSection from '../components/common/BottomSection';
import ContentContainer from '../components/common/ContentContainer';
import ContinueButton from '../components/common/ContinueButton';
import HelperText from '../components/common/HelperText';
import ScreenTitle from '../components/common/ScreenTitle';
import PasswordInput from '../components/form/PasswordInput';
import FormInput from '../components/form/FormInput';
import { loginAPI } from '../services/auth/auth.service';
import AsyncStorage from '@react-native-async-storage/async-storage';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
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

export default function LoginScreen() {
    const navigation = useNavigation();
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [touched, setTouched] = useState({
        email: false,
        password: false,
    });
    // const validateEmail = (email: string) => {
    //     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    //     return emailRegex.test(email);
    // };

    // // Real-time validation
    // useEffect(() => {
    //     const newErrors = { ...errors };

    //     // Email validation
    //     if (touched.email) {
    //         if (!email.trim()) {
    //             newErrors.email = t('errors.emailRequired');
    //         } else if (!validateEmail(email)) {
    //             newErrors.email = t('errors.invalidEmail');
    //         } else {
    //             newErrors.email = '';
    //         }
    //     }

    //     // Password validation
    //     if (touched.password) {
    //         if (!password.trim()) {
    //             newErrors.password = t('errors.passwordRequired');
    //         } else if (!validatePassword(password)) {
    //             newErrors.password = t('errors.passwordTooShort');
    //         } else {
    //             newErrors.password = '';
    //         }
    //     }

    // }, [email, password, touched, t]);

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

    const handleLogin = async () => {
        const response = await loginAPI({ email, password })
        if (response) {
            (navigation.navigate as any)({ name: 'Home' });
            await AsyncStorage.setItem('token', response.token);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#000" />
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
                        error={''}
                    />

                    <PasswordInput
                        label={t('registration.password')}
                        placeholder={t('placeholders.createPassword')}
                        value={password}
                        onChangeText={handlePasswordChange}
                        error={''}
                    />

                    <HelperText
                        text={t('helperTexts.passwordRequirement')}
                        style={styles.passwordRequirements}
                    />
                </View>
            </ContentContainer>

            <BottomSection>
                <ContinueButton onPress={handleLogin} disabled={email === '' || password === ''} />
            </BottomSection>
        </SafeAreaView>
    );
}
