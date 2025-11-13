import React, {useEffect, useState} from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {X} from 'lucide-react-native';

interface SubscriptionStatusModalProps {
  visible: boolean;
  onClose: () => void;
  // Optional: if the parent already fetched the endpoint, pass it here
  subscriptionInfo?: any;
  // Optional callback to notify parent that the subscription was reactivated
  onSubscriptionReactivated?: (updated: any) => void;
  // Backwards compatible props
  isActive?: boolean;
  dueDate?: string | null; // fecha del próximo cobro (opcional)
}

export default function SubscriptionStatusModal({
  visible,
  onClose,
  subscriptionInfo,
  isActive: isActiveProp,
  dueDate: dueDateProp,
  onSubscriptionReactivated,
}: SubscriptionStatusModalProps) {
  const {t} = useTranslation();
  const {token} = require('../../../context/AuthContext').useAuth?.() || {};
  const [localSubscription, setLocalSubscription] = useState<any | null>(
    subscriptionInfo?.subscription ?? null,
  );
  const [reactivating, setReactivating] = useState(false);

  useEffect(() => {
    setLocalSubscription(subscriptionInfo?.subscription ?? null);
  }, [subscriptionInfo]);

  // Prefer data passed from parent via `subscriptionInfo`, otherwise fall back to props
  const hasSubscription =
    subscriptionInfo?.has_subscription ??
    (typeof isActiveProp === 'boolean' ? isActiveProp : false);

  // prefer localSubscription (may be updated after reactivation) otherwise fall back
  const subscription =
    localSubscription ?? subscriptionInfo?.subscription ?? null;
  const rawDue = subscription?.current_period_end ?? dueDateProp ?? null;

  let dueDisplay = rawDue;
  try {
    if (rawDue) {
      const d = new Date(rawDue);
      dueDisplay = isNaN(d.getTime()) ? rawDue : d.toLocaleString();
    }
  } catch (e) {
    // leave raw value
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={22} color={'#FFFFFF'} />
          </TouchableOpacity>

          <Text style={styles.title}>
            {t('subscription.title') || 'Subscription'}
          </Text>

          <View style={styles.content}>
            {hasSubscription ? (
              <>
                <Text style={styles.statusActive}>
                  {subscription
                    ? `${subscription.plan_name || ''}`
                    : t('subscription.success.titlePaid') ||
                      'Subscription active'}
                </Text>
                <Text style={styles.description}>
                  {t('subscription.nextCharge') || 'Next charge:'}{' '}
                  {dueDisplay ?? t('subscription.checkout.freeToday') ?? '—'}
                </Text>

                {subscription && (
                  <Text style={[styles.description, styles.planMeta]}>
                    {`${subscription.payment_method || ''} • ${
                      subscription.amount ?? ''
                    } ${subscription.currency ?? ''}`}
                  </Text>
                )}

                {subscription?.cancel_at_period_end ? (
                  <>
                    <View style={styles.cancelBox}>
                      <Text style={styles.cancelBoxText}>
                        {t('subscription.cancelAtPeriodEnd') ||
                          `Scheduled to cancel at period end: ${dueDisplay}`}
                      </Text>
                    </View>

                    <TouchableOpacity
                      style={styles.reactivateButton}
                      onPress={async () => {
                        try {
                          setReactivating(true);
                          const headers: any = {
                            'Content-Type': 'application/json',
                          };
                          if (token) {
                            headers.Authorization = `Token ${token}`;
                          }

                          const response = await fetch(
                            '/api/payments/reactivate-subscription/',
                            {
                              method: 'POST',
                              headers,
                            },
                          );

                          if (!response.ok) {
                            const text = await response
                              .text()
                              .catch(() => null);
                            throw new Error(
                              text || 'Network response was not ok',
                            );
                          }

                          const data = await response.json().catch(() => null);

                          // backend may return { subscription: { ... } } or the subscription directly
                          const updated = data?.subscription ?? data ?? null;
                          if (updated) {
                            setLocalSubscription(updated);
                            if (onSubscriptionReactivated) {
                              onSubscriptionReactivated(data);
                            }
                          }

                          Alert.alert(
                            t('subscription.reactivatedTitle') ||
                              'Subscription reactivated',
                          );
                        } catch (err) {
                          console.error(
                            'Error reactivating subscription:',
                            err,
                          );
                          Alert.alert(
                            t('subscription.reactivatedError') ||
                              'Could not reactivate subscription. Try again later.',
                          );
                        } finally {
                          setReactivating(false);
                        }
                      }}>
                      {reactivating ? (
                        <ActivityIndicator color="#FFFFFF" />
                      ) : (
                        <Text style={styles.reactivateButtonText}>
                          {t('subscription.actions.reactivate') ||
                            'Reactivate subscription'}
                        </Text>
                      )}
                    </TouchableOpacity>
                  </>
                ) : null}
              </>
            ) : (
              <>
                <Text style={styles.statusInactive}>
                  {t('subscription.error.title') || 'No active subscription'}
                </Text>
                <Text style={styles.description}>
                  {t('subscription.checkoutOptions.option2Description') ||
                    "You don't have an active subscription."}
                </Text>
              </>
            )}
          </View>
          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>
              {t('modalTitles.buttonOptions.close') || 'Close'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 20,
  },
  content: {
    marginVertical: 12,
  },
  closeButton: {
    marginBottom: 12,
    alignItems: 'flex-end',
  },
  title: {
    fontFamily: 'AnonymousPro-Bold',
    fontWeight: '700',
    fontSize: 20,
    color: '#FFFFFF',
    marginBottom: 12,
    alignSelf: 'center',
  },
  statusActive: {
    fontFamily: 'AnonymousPro-Bold',
    fontSize: 18,
    color: '#7ED321',
    textAlign: 'center',
  },
  statusInactive: {
    fontFamily: 'AnonymousPro-Bold',
    fontSize: 18,
    color: '#FF4D4F',
    textAlign: 'center',
  },
  description: {
    fontFamily: 'AnonymousPro-Regular',
    fontSize: 14,
    color: '#CCCCCC',
    marginTop: 8,
    textAlign: 'center',
  },
  planMeta: {
    marginTop: 10,
  },
  cancelBox: {
    marginTop: 14,
    backgroundColor: '#7A1414',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  cancelBoxText: {
    color: '#FFFFFF',
    fontFamily: 'AnonymousPro-Bold',
    textAlign: 'center',
  },
  button: {
    width: '45%',
    backgroundColor: '#2B80BE',
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 25,
    alignSelf: 'center',
  },
  buttonText: {
    fontFamily: 'AnonymousPro-Regular',
    fontWeight: '400',
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  reactivateButton: {
    marginTop: 12,
    backgroundColor: '#2B80BE',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 20,
    alignSelf: 'center',
  },
  reactivateButtonText: {
    fontFamily: 'AnonymousPro-Bold',
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
  },
});
