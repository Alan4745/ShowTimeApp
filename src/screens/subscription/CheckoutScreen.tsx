import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {useAuth} from '../../context/AuthContext';
import {
  stripeService,
  PlanSelectionResponse,
} from '../../services/stripeService';
import {X} from 'lucide-react-native';
import {useStripe} from '@stripe/stripe-react-native';
import ScreenLayout from '../../components/common/ScreenLayout';

export default function CheckoutScreen() {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const route = useRoute();
  const {token} = useAuth();
  const {createPaymentMethod} = useStripe();

  const {planData, productName, skipTrial} = route.params as {
    planData: PlanSelectionResponse;
    productName: string;
    skipTrial: boolean;
  };

  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<any>(null); // Estado para almacenar el método de pago generado

  useEffect(() => {
    const prepareCustomerAndPaymentMethod = async () => {
      if (!token) {
        return;
      }

      try {
        setLoading(true);

        // Preparar el cliente
        const customer = await stripeService.preparePayment(token);
        console.log('✅ Customer preparado:', customer);

        // Generar un método de pago LOCALMENTE usando el SDK de Stripe con tok_visa
        const {paymentMethod: pm, error} = await createPaymentMethod({
          paymentMethodType: 'Card',
          paymentMethodData: {
            token: 'tok_visa', // Token de prueba de Stripe
          },
        });

        if (error) {
          console.error('❌ Error al crear método de pago:', error);
          Alert.alert('Error', error.message);
          return;
        }

        console.log('✅ Método de pago generado localmente:', pm);
        setPaymentMethod(pm);
      } catch (err: any) {
        console.error('❌ Error al preparar cliente o método de pago:', err);
        Alert.alert('Error', err.message);
      } finally {
        setLoading(false);
      }
    };

    prepareCustomerAndPaymentMethod();
  }, [token, createPaymentMethod]);

  const handlePayment = async () => {
    if (!token || !paymentMethod) {
      return;
    }

    try {
      setLoading(true);

      console.log('💳 Método de pago usado:', paymentMethod.id);

      // 2. Llamar al endpoint según la opción elegida
      let result;
      if (skipTrial) {
        // Skip trial y aplicar descuento
        result = await stripeService.skipTrialWithDiscount(
          token,
          paymentMethod.id,
        );
        console.log('✅ Suscripción con descuento:', result);
      } else {
        // Iniciar free trial
        result = await stripeService.startTrial(token, paymentMethod.id);
        console.log('✅ Free trial iniciado:', result);
      }

      // 3. Navegar a pantalla de éxito
      (navigation as any).replace('PaymentSuccess', {
        subscriptionData: result,
        planName: productName,
        skipTrial: skipTrial,
      });
    } catch (err: any) {
      console.error('❌ Error al procesar pago:', err);
      (navigation as any).replace('PaymentError', {
        error: err.message,
        planData: planData,
        productName: productName,
        skipTrial: skipTrial,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenLayout>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => navigation.goBack()}
              disabled={loading}>
              <X size={20} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>
              {t('subscription.checkout.title')}
            </Text>
          </View>

        {/* Plan Summary */}
        <View style={styles.planSummary}>
          <Text style={styles.planName}>{productName}</Text>
          <Text style={styles.planPrice}>
            ${planData.amount.toFixed(2)}/{planData.interval}
          </Text>
          {skipTrial && planData.can_skip_for_discount && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>
                ✨ {t('subscription.checkout.discountBadge')}{' '}
                {planData.discount_percent}%
              </Text>
            </View>
          )}
        </View>

        {/* Payment Info */}
        <View style={styles.paymentInfo}>
          <Text style={styles.sectionTitle}>
            {t('subscription.checkout.paymentInfo')}
          </Text>
          <Text style={styles.sectionSubtitle}>
            {skipTrial
              ? t('subscription.checkout.cardChargedToday')
              : t('subscription.checkout.cardChargedAfter')}
          </Text>
        </View>

        {/* CardField Pre-rellenado */}
        <View style={styles.cardFieldContainer}>
          <Text style={styles.sectionTitle}>{t('subscription.checkout.cardDetails')}</Text>
          <View style={styles.cardField}>
            <Text style={styles.cardFieldText}>Card Number: **** **** **** {paymentMethod?.card?.last4 || 'XXXX'}</Text>
            <Text style={styles.cardFieldText}>Expiry: {paymentMethod?.card?.exp_month || 'MM'}/{paymentMethod?.card?.exp_year || 'YY'}</Text>
            <Text style={styles.cardFieldText}>Brand: {paymentMethod?.card?.brand || 'Unknown'}</Text>
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handlePayment}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.submitButtonText}>
              {skipTrial
                ? `${t(
                    'subscription.checkout.buttonPay',
                  )} $${planData.final_amount_with_discount.toFixed(2)}`
                : t('subscription.checkout.buttonStartTrial')}
            </Text>
          )}
        </TouchableOpacity>

        {/* Footer Note */}
        <Text style={styles.footerNote}>
          {t('subscription.checkout.footerSecure')}
        </Text>
        </View>
      </ScrollView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#252A30',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTitle: {
    fontFamily: 'AnonymousPro-Bold',
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  planSummary: {
    backgroundColor: '#252A30',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  planName: {
    fontFamily: 'AnonymousPro-Bold',
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '700',
    marginBottom: 6,
  },
  planPrice: {
    fontFamily: 'AnonymousPro-Regular',
    fontSize: 16,
    color: '#B9B9B9',
  },
  discountBadge: {
    backgroundColor: 'rgba(43, 128, 190, 0.2)',
    borderWidth: 1,
    borderColor: '#2B80BE',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: 'flex-start',
    marginTop: 12,
  },
  discountText: {
    fontFamily: 'AnonymousPro-Bold',
    fontSize: 12,
    color: '#2B80BE',
    fontWeight: '700',
  },
  paymentInfo: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'AnonymousPro-Bold',
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '700',
    marginBottom: 6,
  },
  sectionSubtitle: {
    fontFamily: 'AnonymousPro-Regular',
    fontSize: 14,
    color: '#929292',
  },
  cardFieldContainer: {
    backgroundColor: '#252A30',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  cardField: {
    marginTop: 12,
  },
  cardFieldText: {
    fontFamily: 'AnonymousPro-Regular',
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  chargeSummary: {
    backgroundColor: '#252A30',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  chargeTitle: {
    fontFamily: 'AnonymousPro-Bold',
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '700',
    marginBottom: 16,
  },
  chargeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  chargeLabel: {
    fontFamily: 'AnonymousPro-Regular',
    fontSize: 14,
    color: '#929292',
  },
  chargeValue: {
    fontFamily: 'AnonymousPro-Bold',
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  discountValue: {
    color: '#4CAF50',
  },
  freeValue: {
    color: '#2B80BE',
  },
  divider: {
    height: 1,
    backgroundColor: '#3A3F47',
    marginVertical: 12,
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
  submitButton: {
    backgroundColor: '#2B80BE',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 32,
    alignItems: 'center',
    marginBottom: 16,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
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
