import React, {useState} from 'react';
import {Text, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import {useAuth} from '../context/AuthContext';
import {stripeService} from '../services/stripeService';
import SubscriptionLayout from '../components/common/SubscriptionLayout';
import ScreenLayout from '../components/common/ScreenLayout';
import ContentContainer from '../components/common/ContentContainer';
import ScreenTitle from '../components/common/ScreenTitle';
import BottomSection from '../components/common/BottomSection';

export default function SubscribeEliteScreen() {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const {token} = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    try {
      setLoading(true);

      if (!token) {
        Alert.alert('Error', 'No estás autenticado');
        return;
      }

      const products = await stripeService.getPlans(token);

      const eliteProduct = products.find(p =>
        p.name.toLowerCase().includes('elite'),
      );

      if (
        !eliteProduct ||
        !eliteProduct.plans ||
        eliteProduct.plans.length === 0
      ) {
        Alert.alert('Error', 'Plan Elite no encontrado');
        return;
      }

      const elitePlan = eliteProduct.plans[0];

      const planData = await stripeService.selectPlan(
        token,
        elitePlan.price_id,
      );

      (navigation as any).navigate('CheckoutOptions', {
        planData,
        productName: eliteProduct.name,
      });
    } catch (err: any) {
      console.error('Error al procesar plan Elite:', err);
      Alert.alert('Error', err.message || 'No se pudo procesar el plan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenLayout>
      <ContentContainer>
        <ScreenTitle title={t('subscription.title')} />
        <SubscriptionLayout planKey="subscription.elite" />
      </ContentContainer>

      <BottomSection>
        <TouchableOpacity
          style={styles.subscribeButton}
          onPress={handleSubscribe}
          disabled={loading}>
          <Text style={styles.subscribeButtonText}>
            {t('subscription.elite.button')}
          </Text>
        </TouchableOpacity>
      </BottomSection>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  subscribeButton: {
    width: 282,
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 32,
    alignItems: 'center',
    marginBottom: 10,
  },

  subscribeButtonText: {
    fontFamily: 'AnonymousPro-Regular',
    color: '#2B80BE',
    fontWeight: '700',
    fontSize: 18,
  },
});
