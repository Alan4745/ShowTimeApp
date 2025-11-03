import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import ScreenLayout from '../../components/common/ScreenLayout';
import {PlanSelectionResponse} from '../../services/stripeService';

export default function CheckoutOptionsScreen() {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const route = useRoute();
  const {planData, productName} = route.params as {
    planData: PlanSelectionResponse;
    productName: string;
  };

  const handleTrialOption = () => {
    (navigation as any).navigate('Checkout', {
      planData,
      productName,
      skipTrial: false,
    });
  };

  const handleDiscountOption = () => {
    (navigation as any).navigate('Checkout', {
      planData,
      productName,
      skipTrial: true,
    });
  };

  return (
    <ScreenLayout>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('subscription.checkoutOptions.title')}</Text>
          <Text style={styles.subtitle}>
            {t('subscription.checkoutOptions.subtitle')} {productName}
          </Text>
        </View>

        {/* Plan Summary */}
        <View style={styles.planSummary}>
          <View style={styles.planHeader}>
            <Text style={styles.planName}>{planData.plan_name}</Text>
            <Text style={styles.planPrice}>
              ${planData.amount.toFixed(2)}/{planData.interval}
            </Text>
          </View>
          {planData.plan_description && (
            <Text style={styles.planDescription}>
              {planData.plan_description}
            </Text>
          )}
        </View>

        {/* Option 1: Free Trial */}
        <TouchableOpacity
          style={styles.optionCard}
          onPress={handleTrialOption}>
          <View style={styles.optionHeader}>
            <Text style={styles.optionTitle}>🎉 {t('subscription.checkoutOptions.option1Title')}</Text>
            <View style={styles.recommendedBadge}>
              <Text style={styles.recommendedText}>{t('subscription.checkoutOptions.option1Subtitle')}</Text>
            </View>
          </View>

          <Text style={styles.optionDescription}>
            {t('subscription.checkoutOptions.option1Description')} ${planData.amount.toFixed(2)}
          </Text>

          <View style={styles.optionDetails}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>{t('subscription.checkoutOptions.option1TodayCharge')}</Text>
              <Text style={styles.detailValue}>$0.00</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>{t('subscription.checkoutOptions.option1AfterTrial')}</Text>
              <Text style={styles.detailValue}>
                ${planData.amount.toFixed(2)}/{planData.interval}
              </Text>
            </View>
          </View>

          <View style={styles.benefits}>
            <Text style={styles.benefitItem}>{t('subscription.checkoutOptions.option1Benefit1')}</Text>
            <Text style={styles.benefitItem}>{t('subscription.checkoutOptions.option1Benefit2')}</Text>
            <Text style={styles.benefitItem}>{t('subscription.checkoutOptions.option1Benefit3')}</Text>
          </View>

          <View style={styles.buttonContainer}>
            <Text style={styles.buttonText}>{t('subscription.checkoutOptions.option1Button')} →</Text>
          </View>
        </TouchableOpacity>

        {/* Option 2: Skip Trial with Discount */}
        {planData.can_skip_for_discount && (
          <TouchableOpacity
            style={styles.optionCard}
            onPress={handleDiscountOption}>
            <View style={styles.optionHeader}>
              <Text style={styles.optionTitle}>
                💰 {t('subscription.checkoutOptions.option2Title')}
              </Text>
            </View>

            <Text style={styles.optionDescription}>
              {t('subscription.checkoutOptions.option2Description')}{' '}
              <Text style={styles.highlight}>
                ${planData.discount_amount.toFixed(2)}
              </Text>
            </Text>

            <View style={styles.optionDetails}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>{t('subscription.checkoutOptions.option2OriginalPrice')}</Text>
                <Text style={[styles.detailValue, styles.strikethrough]}>
                  ${planData.amount.toFixed(2)}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>{t('subscription.checkoutOptions.option2Discount')}</Text>
                <Text style={styles.discountValue}>
                  -${planData.discount_amount.toFixed(2)}
                </Text>
              </View>
              <View style={[styles.detailRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>{t('subscription.checkoutOptions.option2TotalToday')}</Text>
                <Text style={styles.totalValue}>
                  ${planData.final_amount_with_discount.toFixed(2)}
                </Text>
              </View>
            </View>

            <View style={styles.benefits}>
              <Text style={styles.benefitItem}>{t('subscription.checkoutOptions.option2Benefit1')}</Text>
              <Text style={styles.benefitItem}>{t('subscription.checkoutOptions.option2Benefit2')}</Text>
              <Text style={styles.benefitItem}>{t('subscription.checkoutOptions.option2Benefit3')}</Text>
            </View>

            <View style={styles.buttonContainer}>
              <Text style={styles.buttonText}>
                {t('subscription.checkoutOptions.option2Button')} →
              </Text>
            </View>
          </TouchableOpacity>
        )}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {t('subscription.checkoutOptions.footer')}
          </Text>
        </View>
      </ScrollView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontFamily: 'AnonymousPro-Bold',
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'AnonymousPro-Regular',
    fontSize: 14,
    color: '#B9B9B9',
  },
  planSummary: {
    backgroundColor: '#252A30',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  planName: {
    fontFamily: 'AnonymousPro-Bold',
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  planPrice: {
    fontFamily: 'AnonymousPro-Bold',
    fontSize: 16,
    color: '#2B80BE',
    fontWeight: '700',
  },
  planDescription: {
    fontFamily: 'AnonymousPro-Regular',
    fontSize: 14,
    color: '#B9B9B9',
  },
  optionCard: {
    backgroundColor: '#1A1F25',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#2B80BE',
  },
  optionHeader: {
    marginBottom: 10,
  },
  optionTitle: {
    fontFamily: 'AnonymousPro-Bold',
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '700',
    marginBottom: 8,
  },
  recommendedBadge: {
    backgroundColor: '#2B80BE',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  recommendedText: {
    fontFamily: 'AnonymousPro-Bold',
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  optionDescription: {
    fontFamily: 'AnonymousPro-Regular',
    fontSize: 14,
    color: '#B9B9B9',
    marginBottom: 16,
    lineHeight: 20,
  },
  highlight: {
    color: '#2B80BE',
    fontWeight: '700',
  },
  optionDetails: {
    backgroundColor: '#252A30',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
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
  strikethrough: {
    textDecorationLine: 'line-through',
    color: '#929292',
  },
  discountValue: {
    fontFamily: 'AnonymousPro-Bold',
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '700',
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#3A3F47',
  },
  totalLabel: {
    fontFamily: 'AnonymousPro-Bold',
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  totalValue: {
    fontFamily: 'AnonymousPro-Bold',
    fontSize: 18,
    color: '#2B80BE',
    fontWeight: '700',
  },
  benefits: {
    marginBottom: 20,
    gap: 8,
  },
  benefitItem: {
    fontFamily: 'AnonymousPro-Regular',
    fontSize: 14,
    color: '#B9B9B9',
  },
  buttonContainer: {
    backgroundColor: '#2B80BE',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 32,
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'AnonymousPro-Bold',
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  footer: {
    alignItems: 'center',
    marginTop: 24,
  },
  footerText: {
    fontFamily: 'AnonymousPro-Regular',
    fontSize: 12,
    color: '#929292',
  },
});
