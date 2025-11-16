import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import {LinearGradient} from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';
import {useRegistration} from '../context/RegistrationContext';
import {Image} from 'react-native';
import {useTranslation} from 'react-i18next';
import LoginModal from '../components/modals/LoginModal';

export default function RegisterMethodScreen() {
  const {updateData} = useRegistration();
  const navigation = useNavigation();
  const {t} = useTranslation();

  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleGoogleSignUp = () => {
    // Mock Google authentication
    updateData({
      authMethod: 'google',
      email: 'user@gmail.com', // Mock email from Google
      username: 'GoogleUser', // Mock username from Google
    });
    (navigation.navigate as any)({name: 'SelectRole'});
  };

  const handleAppleSignUp = () => {
    // Mock Apple authentication
    updateData({
      authMethod: 'apple',
      email: 'user@privaterelay.appleid.com', // Mock Apple private email
      username: 'AppleUser', // Mock username from Apple
    });
    (navigation.navigate as any)({name: 'SelectRole'});
  };

  const handleCreateAccount = () => {
    (navigation.navigate as any)({name: 'CreateAccount'});
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      <View style={styles.content}>
        {/* Main buttons section */}
        <View style={styles.buttonsContainer}>
          {/* Google Sign Up (Próximamente - deshabilitado) */}
          <TouchableOpacity
            style={[styles.socialButton, styles.disabledButton]}
            onPress={handleGoogleSignUp}
            disabled={true}
            accessibilityState={{disabled: true}}>
            <View style={styles.iconContainer}>
              <View style={styles.googleIcon}>
                <Image source={require('../../assets/img/icon/Google.png')} />
              </View>
            </View>
            <Text style={[styles.socialButtonText, styles.disabledText]}>
              {t('registration.comingSoon')}
            </Text>
          </TouchableOpacity>

          {/* Apple Sign Up (Próximamente - deshabilitado) */}
          <TouchableOpacity
            style={[styles.socialButton, styles.disabledButton]}
            onPress={handleAppleSignUp}
            disabled={true}
            accessibilityState={{disabled: true}}>
            <View style={styles.iconContainer}>
              <Image source={require('../../assets/img/icon/Apple_Icon.png')} />
            </View>
            <Text style={[styles.socialButtonText, styles.disabledText]}>
              {t('registration.comingSoon')}
            </Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Create Account */}
          <TouchableOpacity onPress={handleCreateAccount}>
            <LinearGradient
              colors={['#4A90E2', '#357ABD']}
              style={styles.createAccountButton}>
              <Text style={styles.createAccountText}>
                {t('registration.createAccount')}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Bottom section */}
        <View style={styles.bottomSection}>
          <Text style={styles.alreadyHaveText}>
            {t('registration.alreadyHaveAccount')}
          </Text>

          <TouchableOpacity
            style={styles.signInButton}
            onPress={() => setShowLoginModal(true)}>
            <Text style={styles.signInText}>{t('registration.signIn')}</Text>
          </TouchableOpacity>

          {/* Terms and Privacy */}
          <View style={styles.termsContainer}>
            <Text style={styles.termsText}>
              {t('registration.termsAcceptance')}
              <Text
                style={styles.linkText}
                onPress={() => (navigation as any).navigate('TermsConditions')}>
                {t('registration.termsLink')}
              </Text>
              .
            </Text>
          </View>
        </View>
        {/* Login Modal*/}
        <LoginModal
          visible={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onSuccess={() => (navigation as any).navigate('Home')}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  buttonsContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: 16,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 50,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    marginLeft: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 1,
  },
  googleIcon: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleG: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  appleIcon: {
    fontSize: 22,
    color: '#000',
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    flex: 1,
    textAlign: 'center',
    marginRight: 40,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#333',
  },
  dividerText: {
    fontFamily: 'AnonymousPro-Bold',
    color: '#666',
    fontSize: 14,
    marginHorizontal: 16,
    fontWeight: '500',
  },
  createAccountButton: {
    borderRadius: 50,
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    height: 56,
    marginBottom: 20,
    shadowColor: '#4A90E2',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  createAccountText: {
    fontFamily: 'AnonymousPro-Bold',
    color: '#fff',
    fontSize: 19,
    fontWeight: '400',
  },
  bottomSection: {
    alignItems: 'center',
    gap: 16,
  },
  alreadyHaveText: {
    color: '#666',
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '500',
  },
  signInButton: {
    backgroundColor: '#fff',
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 50,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  signInText: {
    fontFamily: 'AnonymousPro-Bold',
    color: '#000',
    fontSize: 19,
    fontWeight: '400',
  },
  termsContainer: {
    paddingHorizontal: 20,
  },
  termsText: {
    fontFamily: 'AnonymousPro-Regular',
    color: '#666',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 16,
    fontWeight: '400',
  },
  disabledButton: {
    backgroundColor: '#f2f2f2',
    opacity: 0.9,
  },
  disabledText: {
    color: '#999',
  },
  linkText: {
    fontFamily: 'AnonymousPro-Regular',
    color: '#4A90E2',
    textDecorationLine: 'underline',
    fontSize: 13,
    fontWeight: '400',
  },
});
