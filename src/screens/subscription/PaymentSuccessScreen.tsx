import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {CheckCircle} from 'lucide-react-native';
import ScreenLayout from '../../components/common/ScreenLayout';
import LottieIcon from '../../components/common/LottieIcon';
import successAnimation from '../../../assets/lottie/Success.json';

export default function PaymentSuccessScreen() {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const route = useRoute();

  const {subscriptionData, planName, skipTrial} = route.params as {
    subscriptionData: any;
    planName: string;
    skipTrial: boolean;
  };

  const handleContinue = () => {
    // Navegar al Home o Dashboard
    (navigation as any).reset({
      index: 0,
      routes: [{name: 'Home'}],
    });
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) {
      return '';
    }
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <ScreenLayout>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          {/* Success Animation */}
          <View style={styles.animationContainer}>
            <LottieIcon
              source={successAnimation}
              size={150}
              loop={false}
              autoPlay={true}
            />
          </View>

          {/* Success Message */}
          <View style={styles.messageContainer}>
            <View style={styles.iconContainer}>
              <CheckCircle size={24} color="#4CAF50" />
            </View>
          <Text style={styles.title}>
            {skipTrial ? t('subscription.success.titlePaid') : t('subscription.success.titleTrial')}
          </Text>
          <Text style={styles.subtitle}>
            {skipTrial
              ? t('subscription.success.subtitlePaid')
              : t('subscription.success.subtitleTrial') + ' ' + planName}
          </Text>
        </View>

        {/* Subscription Details */}
        <View style={styles.detailsCard}>
          <Text style={styles.detailsTitle}>{t('subscription.success.detailsTitle')}</Text>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>{t('subscription.success.plan')}</Text>
            <Text style={styles.detailValue}>{planName}</Text>
          </View>

          {skipTrial ? (
            <>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>{t('subscription.success.charged')}</Text>
                <Text style={styles.detailValue}>
                  ${subscriptionData.final_amount?.toFixed(2) || '0.00'}
                </Text>
              </View>
              {subscriptionData.discount_percent && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>{t('subscription.success.discount')}</Text>
                  <Text style={[styles.detailValue, styles.discountText]}>
                    {subscriptionData.discount_percent}% OFF
                  </Text>
                </View>
              )}
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>{t('subscription.success.status')}</Text>
                <Text style={[styles.detailValue, styles.activeText]}>
                  {t('subscription.success.active')}
                </Text>
              </View>
            </>
          ) : (
            <>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>{t('subscription.success.trialEnds')}</Text>
                <Text style={styles.detailValue}>
                  {formatDate(subscriptionData.trial_ends_at)}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>{t('subscription.success.nextCharge')}</Text>
                <Text style={[styles.detailValue, styles.trialText]}>
                  {subscriptionData.trial_days_remaining} días
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>{t('subscription.success.status')}</Text>
                <Text style={[styles.detailValue, styles.trialText]}>
                  {t('subscription.success.trialing')}
                </Text>
              </View>
            </>
          )}
        </View>

        {/* Benefits */}
        <View style={styles.benefitsCard}>
          <Text style={styles.benefitsTitle}>{t('subscription.success.benefitsTitle')}</Text>
          <View style={styles.benefitsList}>
            <Text style={styles.benefitItem}>{t('subscription.success.benefit1')}</Text>
            <Text style={styles.benefitItem}>{t('subscription.success.benefit2')}</Text>
            <Text style={styles.benefitItem}>{t('subscription.success.benefit3')}</Text>
            <Text style={styles.benefitItem}>{t('subscription.success.benefit4')}</Text>
          </View>
        </View>

        {/* Continue Button */}
        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueButtonText}>{t('subscription.success.buttonHome')}</Text>
        </TouchableOpacity>

        {/* Footer Note */}
        <Text style={styles.footerNote}>
          {t('subscription.success.footerNote')}
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
    lineHeight: 24,
  },
  detailsCard: {
    backgroundColor: '#252A30',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  detailsTitle: {
    fontFamily: 'AnonymousPro-Bold',
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '700',
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailLabel: {
    fontFamily: 'AnonymousPro-Regular',
    fontSize: 14,
    color: '#929292',
  },
  detailValue: {
    fontFamily: 'AnonymousPro-Bold',
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  discountText: {
    color: '#4CAF50',
  },
  activeText: {
    color: '#4CAF50',
  },
  trialText: {
    color: '#2B80BE',
  },
  benefitsCard: {
    backgroundColor: 'rgba(43, 128, 190, 0.1)',
    borderWidth: 1,
    borderColor: '#2B80BE',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  benefitsTitle: {
    fontFamily: 'AnonymousPro-Bold',
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '700',
    marginBottom: 12,
  },
  benefitsList: {
    gap: 8,
  },
  benefitItem: {
    fontFamily: 'AnonymousPro-Regular',
    fontSize: 14,
    color: '#B9B9B9',
  },
  continueButton: {
    backgroundColor: '#2B80BE',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 32,
    alignItems: 'center',
    marginBottom: 16,
  },
  continueButtonText: {
    fontFamily: 'AnonymousPro-Bold',
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  footerNote: {
    fontFamily: 'AnonymousPro-Regular',
    fontSize: 12,
    color: '#929292',
    textAlign: 'center',
  },
});
