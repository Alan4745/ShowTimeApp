import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {useAuth} from '../../context/AuthContext';
import ScreenLayout from '../../components/common/ScreenLayout';
import PlanCard from '../../components/subscription/PlanCard';
import {stripeService, StripeProduct} from '../../services/stripeService';

export default function PlansScreen() {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const {token} = useAuth();

  const [plans, setPlans] = useState<StripeProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPlans();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!token) {
        throw new Error(t('subscription.plansScreen.noAuth'));
      }

      const productsData = await stripeService.getPlans(token);
      setPlans(productsData);
    } catch (err: any) {
      console.error('Error al obtener planes:', err);
      setError(err.message || t('subscription.plansScreen.error'));
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlan = async (productName: string) => {
    try {
      // Determinar a qué pantalla navegar según el nombre del plan
      const planNameLower = productName.toLowerCase();

      let targetScreen = null;
      if (planNameLower.includes('basic')) {
        targetScreen = 'SubscribeBasic';
      } else if (planNameLower.includes('premium')) {
        targetScreen = 'SubscribePremium';
      } else if (planNameLower.includes('elite')) {
        targetScreen = 'SubscribeElite';
      }

      // Si no es uno de nuestros planes conocidos, no hacer nada
      if (!targetScreen) {
        console.log('Plan no reconocido, ignorando:', productName);
        return;
      }

      // Navegar a la pantalla detallada del plan
      (navigation as any).navigate(targetScreen);
    } catch (err: any) {
      console.error('Error al seleccionar plan:', err);
      setError(err.message || t('subscription.plansScreen.selectError'));
    }
  };

  if (loading) {
    return (
      <ScreenLayout>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#2B80BE" />
          <Text style={styles.loadingText}>
            {t('subscription.plansScreen.loading')}
          </Text>
        </View>
      </ScreenLayout>
    );
  }

  if (error) {
    return (
      <ScreenLayout>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {t('subscription.plansScreen.title')}
          </Text>
          <Text style={styles.subtitle}>
            {t('subscription.plansScreen.subtitle')}
          </Text>
        </View>

        <View style={styles.plansContainer}>
          {plans.map(product =>
            product.plans.map(plan => {
              // Marcar Premium como popular
              const isPopular = product.name.toLowerCase().includes('premium');

              return (
                <PlanCard
                  key={`${product.id}-${plan.price_id}`}
                  product={product}
                  plan={plan}
                  onSelect={() => handleSelectPlan(product.name)}
                  isPopular={isPopular}
                />
              );
            }),
          )}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            • {t('subscription.plansScreen.footerCancel')}
          </Text>
          <Text style={styles.footerText}>
            • {t('subscription.plansScreen.footerNoCharge')}
          </Text>
          <Text style={styles.footerText}>
            • {t('subscription.plansScreen.footerFullAccess')}
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontFamily: 'AnonymousPro-Bold',
    fontSize: 32,
    color: '#FFFFFF',
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'AnonymousPro-Regular',
    fontSize: 16,
    color: '#B9B9B9',
    textAlign: 'center',
    lineHeight: 24,
  },
  plansContainer: {
    marginBottom: 32,
  },
  loadingText: {
    fontFamily: 'AnonymousPro-Regular',
    fontSize: 16,
    color: '#B9B9B9',
    marginTop: 16,
  },
  errorText: {
    fontFamily: 'AnonymousPro-Regular',
    fontSize: 16,
    color: '#F44336',
    textAlign: 'center',
  },
  footer: {
    gap: 8,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#3A3F47',
  },
  footerText: {
    fontFamily: 'AnonymousPro-Regular',
    fontSize: 14,
    color: '#929292',
    textAlign: 'center',
  },
});
