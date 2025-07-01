import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';
import {useNavigation } from '@react-navigation/native';
import { useRegistration } from '../context/RegistrationContext';

export default function RegisterMethodScreen() {
  const { updateData } = useRegistration();
  const navigation = useNavigation();

  const handleGoogleSignUp = () => {
    // Mock Google authentication
    updateData({
      authMethod: 'google',
      email: 'user@gmail.com', // Mock email from Google
      username: 'GoogleUser', // Mock username from Google
    });
    (navigation.navigate as any)({ name: 'RegisterMethod' });
  };

  const handleAppleSignUp = () => {
    // Mock Apple authentication
    updateData({
      authMethod: 'apple',
      email: 'user@privaterelay.appleid.com', // Mock Apple private email
      username: 'AppleUser', // Mock username from Apple
    });
    (navigation.navigate as any)({ name: 'Username' });
  };

  const handleCreateAccount = () => {
    (navigation.navigate as any)({ name: 'CreateAccount' });
  };

  const handleSignIn = () => {
    console.log('Sign in pressed');
    // Here you would implement sign in logic
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      <View style={styles.content}>
        {/* Main buttons section */}
        <View style={styles.buttonsContainer}>
          {/* Google Sign Up */}
          <TouchableOpacity style={styles.socialButton} onPress={handleGoogleSignUp}>
            <View style={styles.iconContainer}>
              <View style={styles.googleIcon}>
                <Text style={styles.googleG}>G</Text>
              </View>
            </View>
            <Text style={styles.socialButtonText}>Sign up with Google</Text>
          </TouchableOpacity>

          {/* Apple Sign Up */}
          <TouchableOpacity style={styles.socialButton} onPress={handleAppleSignUp}>
            <View style={styles.iconContainer}>
              <Text style={styles.appleIcon}>🍎</Text>
            </View>
            <Text style={styles.socialButtonText}>Sign up with Apple</Text>
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
              style={styles.createAccountButton}
            >
              <Text style={styles.createAccountText}>Create account</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Bottom section */}
        <View style={styles.bottomSection}>
          <Text style={styles.alreadyHaveText}>Already have an account?</Text>

          <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
            <Text style={styles.signInText}>Sign in</Text>
          </TouchableOpacity>

          {/* Terms and Privacy */}
          <View style={styles.termsContainer}>
            <Text style={styles.termsText}>
              By signing up, you agree to the{' '}
              <Text style={styles.linkText}>Terms of Service</Text>
              {' '}and{' '}
              <Text style={styles.linkText}>Privacy Policy</Text>
              , including{' '}
              <Text style={styles.linkText}>Cookie Use</Text>.
            </Text>
          </View>
        </View>
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
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4285F4',
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
    color: '#666',
    fontSize: 14,
    marginHorizontal: 16,
    fontWeight: '500',
  },
  createAccountButton: {
    paddingVertical: 18,
    borderRadius: 50,
    alignItems: 'center',
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
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  termsContainer: {
    paddingHorizontal: 20,
  },
  termsText: {
    color: '#666',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
  linkText: {
    color: '#4A90E2',
    textDecorationLine: 'underline',
  },
});
