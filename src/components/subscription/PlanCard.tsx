import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';
import {StripePlan, StripeProduct} from '../../services/stripeService';

interface PlanCardProps {
  product: StripeProduct;
  plan: StripePlan;
  onSelect: () => void;
  isPopular?: boolean;
}

export default function PlanCard({
  product,
  plan,
  onSelect,
  isPopular = false,
}: PlanCardProps) {
  const {t} = useTranslation();
  const formatPrice = (amount: number) => {
    return (amount / 100).toFixed(2);
  };

  const getIntervalText = (interval: string) => {
    return interval === 'month' ? '/mes' : '/año';
  };

  return (
    <View style={[styles.container, isPopular && styles.popularContainer]}>
      {isPopular && (
        <View style={styles.popularBadge}>
          <Text style={styles.popularText}>{t('subscription.planCard.popular')}</Text>
        </View>
      )}

      <View style={styles.header}>
        <Text style={styles.planName}>{product.name}</Text>
        {product.description && (
          <Text style={styles.description}>{product.description}</Text>
        )}
      </View>

      <View style={styles.priceSection}>
        <Text style={styles.currency}>$</Text>
        <Text style={styles.price}>{formatPrice(plan.unit_amount)}</Text>
        <Text style={styles.interval}>{getIntervalText(plan.interval)}</Text>
      </View>

      <TouchableOpacity
        style={[styles.button, isPopular && styles.popularButton]}
        onPress={onSelect}>
        <Text style={[styles.buttonText, isPopular && styles.popularButtonText]}>
          {t('subscription.planCard.startTrial')}
        </Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {t('subscription.planCard.then')} ${formatPrice(plan.unit_amount)}
          {getIntervalText(plan.interval)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#252A30',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  popularContainer: {
    borderColor: '#2B80BE',
    borderWidth: 2,
    backgroundColor: 'rgba(43, 128, 190, 0.1)',
  },
  popularBadge: {
    position: 'absolute',
    top: -12,
    alignSelf: 'center',
    backgroundColor: '#2B80BE',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  popularText: {
    fontFamily: 'AnonymousPro-Bold',
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  header: {
    marginBottom: 20,
  },
  planName: {
    fontFamily: 'AnonymousPro-Bold',
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: '700',
    marginBottom: 8,
  },
  description: {
    fontFamily: 'AnonymousPro-Regular',
    fontSize: 14,
    color: '#B9B9B9',
    lineHeight: 20,
  },
  priceSection: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 24,
  },
  currency: {
    fontFamily: 'AnonymousPro-Bold',
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  price: {
    fontFamily: 'AnonymousPro-Bold',
    fontSize: 48,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  interval: {
    fontFamily: 'AnonymousPro-Regular',
    fontSize: 16,
    color: '#B9B9B9',
    marginLeft: 4,
  },
  button: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 32,
    alignItems: 'center',
    marginBottom: 12,
  },
  popularButton: {
    backgroundColor: '#2B80BE',
  },
  buttonText: {
    fontFamily: 'AnonymousPro-Bold',
    fontSize: 16,
    color: '#2B80BE',
    fontWeight: '700',
  },
  popularButtonText: {
    color: '#FFFFFF',
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontFamily: 'AnonymousPro-Regular',
    fontSize: 12,
    color: '#929292',
  },
});
