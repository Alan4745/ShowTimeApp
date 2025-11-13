import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {AlertCircle, RefreshCcw} from 'lucide-react-native';
import ScreenLayout from '../../components/common/ScreenLayout';
import LottieIcon from '../../components/common/LottieIcon';
import alertAnimation from '../../../assets/lottie/alert.json';
import {PlanSelectionResponse} from '../../services/stripeService';

export default function PaymentErrorScreen() {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const route = useRoute();

  const {error, planData, productName, skipTrial} = route.params as {
    error: string;
    planData: PlanSelectionResponse;
    productName: string;
    skipTrial: boolean;
  };

  const handleRetry = () => {
    // Volver a la pantalla de checkout
    (navigation as any).replace('Checkout', {
      planData,
      productName,
      skipTrial,
    });
  };

  const handleGoBack = () => {
    // Volver a la pantalla de planes
    (navigation as any).navigate('Plans');
  };

  const handleGoHome = () => {
    // Ir al inicio
    (navigation as any).reset({
      index: 0,
      routes: [{name: 'Home'}],
    });
  };

  const getErrorMessage = (errorText: string) => {
    // Personalizar mensajes de error comunes
    if (errorText.toLowerCase().includes('card')) {
      return t('subscription.error.cardError');
    }
    if (errorText.toLowerCase().includes('insufficient')) {
      return t('subscription.error.insufficientError');
    }
    if (errorText.toLowerCase().includes('declined')) {
      return t('subscription.error.declinedError');
    }
    return errorText;
  };

  return (
    <ScreenLayout>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          {/* Error Animation */}
          <View style={styles.animationContainer}>
            <LottieIcon
              source={alertAnimation}
              size={150}
              loop={true}
              autoPlay={true}
            />
          </View>

          {/* Error Message */}
          <View style={styles.messageContainer}>
            <View style={styles.iconContainer}>
              <AlertCircle size={24} color="#F44336" />
            </View>
          <Text style={styles.title}>{t('subscription.error.title')}</Text>
          <Text style={styles.subtitle}>{t('subscription.error.subtitle')}</Text>
        </View>

        {/* Error Details */}
        <View style={styles.errorCard}>
          <Text style={styles.errorTitle}>{t('subscription.error.errorTitle')}</Text>
          <Text style={styles.errorMessage}>{getErrorMessage(error)}</Text>
        </View>

        {/* What to do */}
        <View style={styles.suggestionsCard}>
          <Text style={styles.suggestionsTitle}>{t('subscription.error.suggestionsTitle')}</Text>
          <View style={styles.suggestionsList}>
            <Text style={styles.suggestionItem}>
              {t('subscription.error.suggestion1')}
            </Text>
            <Text style={styles.suggestionItem}>
              {t('subscription.error.suggestion2')}
            </Text>
            <Text style={styles.suggestionItem}>
              {t('subscription.error.suggestion3')}
            </Text>
            <Text style={styles.suggestionItem}>
              {t('subscription.error.suggestion4')}
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
          <RefreshCcw size={20} color="#FFFFFF" style={styles.buttonIcon} />
          <Text style={styles.retryButtonText}>{t('subscription.error.buttonRetry')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Text style={styles.backButtonText}>{t('subscription.error.buttonBack')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.homeButton} onPress={handleGoHome}>
          <Text style={styles.homeButtonText}>{t('subscription.error.buttonHome')}</Text>
        </TouchableOpacity>

        {/* Support Note */}
        <Text style={styles.supportNote}>
          {t('subscription.error.supportNote')}
        </Text>
        </View>
      </ScrollView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  container: {
    flex: 1,
  },
  animationContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  messageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  iconContainer: {
    marginBottom: 12,
  },
  title: {
    fontFamily: 'AnonymousPro-Bold',
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'AnonymousPro-Regular',
    fontSize: 16,
    color: '#B9B9B9',
    textAlign: 'center',
  },
  errorCard: {
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    borderWidth: 1,
    borderColor: '#F44336',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  errorTitle: {
    fontFamily: 'AnonymousPro-Bold',
    fontSize: 16,
    color: '#F44336',
    fontWeight: '700',
    marginBottom: 8,
  },
  errorMessage: {
    fontFamily: 'AnonymousPro-Regular',
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 20,
  },
  suggestionsCard: {
    backgroundColor: '#252A30',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  suggestionsTitle: {
    fontFamily: 'AnonymousPro-Bold',
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '700',
    marginBottom: 12,
  },
  suggestionsList: {
    gap: 8,
  },
  suggestionItem: {
    fontFamily: 'AnonymousPro-Regular',
    fontSize: 14,
    color: '#B9B9B9',
    lineHeight: 20,
  },
  retryButton: {
    flexDirection: 'row',
    backgroundColor: '#2B80BE',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  buttonIcon: {
    marginRight: 8,
  },
  retryButtonText: {
    fontFamily: 'AnonymousPro-Bold',
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  backButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#2B80BE',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 32,
    alignItems: 'center',
    marginBottom: 10,
  },
  backButtonText: {
    fontFamily: 'AnonymousPro-Bold',
    fontSize: 15,
    color: '#2B80BE',
    fontWeight: '700',
  },
  homeButton: {
    backgroundColor: 'transparent',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 32,
    alignItems: 'center',
    marginBottom: 16,
  },
  homeButtonText: {
    fontFamily: 'AnonymousPro-Regular',
    fontSize: 14,
    color: '#929292',
  },
  supportNote: {
    fontFamily: 'AnonymousPro-Regular',
    fontSize: 12,
    color: '#929292',
    textAlign: 'center',
    marginTop: 8,
  },
});
