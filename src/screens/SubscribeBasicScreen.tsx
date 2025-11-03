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

export default function SubscribeBasicScreen() {
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

      // Obtener todos los planes
      const products = await stripeService.getPlans(token);

      // Buscar el plan Basic
      const basicProduct = products.find(p =>
        p.name.toLowerCase().includes('basic'),
      );

      if (
        !basicProduct ||
        !basicProduct.plans ||
        basicProduct.plans.length === 0
      ) {
        Alert.alert('Error', 'Plan Basic no encontrado');
        return;
      }

      const basicPlan = basicProduct.plans[0];

      // Seleccionar el plan para obtener los datos completos
      const planData = await stripeService.selectPlan(
        token,
        basicPlan.price_id,
      );

      // Navegar a CheckoutOptions
      (navigation as any).navigate('CheckoutOptions', {
        planData,
        productName: basicProduct.name,
      });
    } catch (err: any) {
      console.error('Error al procesar plan Basic:', err);
      Alert.alert('Error', err.message || 'No se pudo procesar el plan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenLayout>
      <ContentContainer>
        <ScreenTitle title={t('subscription.title')} />
        <SubscriptionLayout planKey="subscription.basic" />
      </ContentContainer>

      <BottomSection>
        <TouchableOpacity
          style={styles.subscribeButton}
          onPress={handleSubscribe}
          disabled={loading}>
          <Text style={styles.subscribeButtonText}>
            {t('subscription.basic.button')}
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
