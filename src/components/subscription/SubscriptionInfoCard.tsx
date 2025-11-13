import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useTranslation} from 'react-i18next';
import {SubscriptionData} from '../../services/stripeService';

interface SubscriptionInfoCardProps {
  subscription: SubscriptionData;
  onCancel?: () => void;
  showCancelButton?: boolean;
}

export default function SubscriptionInfoCard({
  subscription,
  onCancel,
  showCancelButton = true,
}: SubscriptionInfoCardProps) {
  const {t} = useTranslation();
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      trialing: t('subscription.subscriptionInfo.statusTrialing'),
      active: t('subscription.subscriptionInfo.statusActive'),
      past_due: t('subscription.subscriptionInfo.statusPastDue'),
      canceled: t('subscription.subscriptionInfo.statusCanceled'),
      unpaid: t('subscription.subscriptionInfo.statusUnpaid'),
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      trialing: '#2B80BE',
      active: '#4CAF50',
      past_due: '#FF9800',
      canceled: '#929292',
      unpaid: '#F44336',
    };
    return colorMap[status] || '#929292';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.planName}>{subscription.plan_name}</Text>
          <View style={styles.statusContainer}>
            <View
              style={[
                styles.statusDot,
                {backgroundColor: getStatusColor(subscription.status)},
              ]}
            />
            <Text style={styles.statusText}>
              {getStatusText(subscription.status)}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.infoSection}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>{t('subscription.subscriptionInfo.price')}</Text>
          <Text style={styles.value}>
            ${subscription.amount.toFixed(2)} / {subscription.interval}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>{t('subscription.subscriptionInfo.paymentMethod')}</Text>
          <Text style={styles.value}>{subscription.payment_method}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>
            {subscription.cancel_at_period_end
              ? t('subscription.subscriptionInfo.cancelAt')
              : t('subscription.subscriptionInfo.nextRenewal')}
          </Text>
          <Text style={styles.value}>
            {formatDate(subscription.current_period_end)}
          </Text>
        </View>
      </View>

      {subscription.cancel_at_period_end && (
        <View style={styles.warningBanner}>
          <Text style={styles.warningText}>
            {t('subscription.subscriptionInfo.warningCancel')}{' '}
            {formatDate(subscription.current_period_end)}
          </Text>
        </View>
      )}

      {showCancelButton && !subscription.cancel_at_period_end && onCancel && (
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelButtonText}>{t('subscription.subscriptionInfo.buttonCancel')}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#252A30',
    borderRadius: 20,
    padding: 20,
  },
  header: {
    marginBottom: 16,
  },
  planName: {
    fontFamily: 'AnonymousPro-Bold',
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: '700',
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontFamily: 'AnonymousPro-Regular',
    fontSize: 14,
    color: '#B9B9B9',
  },
  divider: {
    height: 1,
    backgroundColor: '#3A3F47',
    marginBottom: 16,
  },
  infoSection: {
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontFamily: 'AnonymousPro-Regular',
    fontSize: 14,
    color: '#929292',
  },
  value: {
    fontFamily: 'AnonymousPro-Bold',
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  warningBanner: {
    backgroundColor: 'rgba(255, 152, 0, 0.1)',
    borderWidth: 1,
    borderColor: '#FF9800',
    borderRadius: 12,
    padding: 12,
    marginTop: 16,
  },
  warningText: {
    fontFamily: 'AnonymousPro-Regular',
    fontSize: 12,
    color: '#FF9800',
    textAlign: 'center',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#F44336',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 32,
    alignItems: 'center',
    marginTop: 16,
  },
  cancelButtonText: {
    fontFamily: 'AnonymousPro-Bold',
    fontSize: 14,
    color: '#F44336',
    fontWeight: '700',
  },
});
