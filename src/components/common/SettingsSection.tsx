import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import {Bell, Star, CircleHelp, X, Power, User} from 'lucide-react-native';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import {ChatParamList} from '../../types';
import type {StackNavigationProp} from '@react-navigation/stack';
import {useAuth} from '../../context/AuthContext';
import HighlightModal from '../modals/HighlightModal';
import SubscriptionStatusModal from '../modals/subscription/subscriptioModalStatus';
import MyReferralsModal from '../modals/MyReferrals/MyReferralsModal';
import {buildMediaUrl} from '../../utils/urlHelpers';
import {fetchWithTimeout} from '../../utils/fetchWithTimeout';
const {Alert, Linking} = require('react-native');
const perms = require('react-native-permissions');

type SettingsSectionProps = {
  userType: 'student' | 'coach' | 'darwin';
};

type SettingOption = {
  icon: React.ElementType;
  label: string;
  onPress?: () => void;
};

type ChatNavigationProp = StackNavigationProp<ChatParamList, 'Chat'>;

const SettingItem = ({icon: Icon, label, onPress}: SettingOption) => (
  <TouchableOpacity style={styles.mainSectionLine} onPress={onPress}>
    <Icon size={24} style={styles.icon} />
    <Text style={styles.mainSectionText}>{label}</Text>
  </TouchableOpacity>
);

export default function SettingsSection({userType}: SettingsSectionProps) {
  const {t} = useTranslation();
  const {user, logout, token} = useAuth();
  const {height} = useWindowDimensions();
  const navigation = useNavigation<ChatNavigationProp>();
  const [showHighlightModal, setShowHighlightModal] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [showReferralsModal, setShowReferralsModal] = useState(false);
  const [subscriptionData, setSubscriptionData] = useState<any | null>(null);
  const [subscriptionLoading, setSubscriptionLoading] = useState(false);

  // Load subscription info on mount so we can adapt UI (e.g. hide cancel button
  // when cancel_at_period_end === true). Also re-runs when token changes.
  useEffect(() => {
    let mounted = true;

    const loadSubscription = async () => {
      try {
        setSubscriptionLoading(true);
        const headers: any = {'Content-Type': 'application/json'};
        if (token) {
          headers.Authorization = `Token ${token}`;
        }

        const response = await fetchWithTimeout(
          '/api/payments/my-subscription/',
          {
            method: 'GET',
            headers,
          },
        );

        if (!response.ok) {
          // don't throw here; silently ignore so UI still works
          console.warn('Could not fetch subscription on mount');
          return;
        }

        const data = await response.json();
        if (mounted) {
          setSubscriptionData(data);
        }
      } catch (error) {
        console.error('Error fetching subscription on mount:', error);
      } finally {
        if (mounted) {
          setSubscriptionLoading(false);
        }
      }
    };

    loadSubscription();

    return () => {
      mounted = false;
    };
  }, [token]);

  const requestNotificationPermission = async () => {
    try {
      // use react-native-permissions if it's installed in the project
      const {requestNotifications, RESULTS} = perms;

      // request notifications (works for iOS and Android when using react-native-permissions)
      const result = await requestNotifications(['alert', 'sound', 'badge']);
      const status = result?.status ?? result;

      if (status === 'granted' || status === RESULTS?.GRANTED) {
        Alert.alert(
          t('account.notifications.enabled') || 'Notificaciones activadas',
        );
      } else if (status === 'blocked' || status === RESULTS?.BLOCKED) {
        Alert.alert(
          t('account.notifications.blockedTitle') ||
            'Permisos de notificaciones bloqueados',
          t('account.notifications.blockedMessage') ||
            'Por favor activa las notificaciones desde la configuración.',
          [
            {
              text: t('account.buttons.cancel') || 'Cancelar',
              style: 'cancel',
            },
            {
              text: t('account.buttons.openSettings') || 'Abrir ajustes',
              onPress: () => Linking.openSettings(),
            },
          ],
        );
      } else {
        // denied or unavailable
        Alert.alert(
          t('account.notifications.denied') ||
            'Permisos de notificaciones denegados',
        );
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      Alert.alert(
        t('account.notifications.error') ||
          'No se pudo solicitar permisos de notificación',
      );
    }
  };

  const AlertCancelarSuscripcion = () => {
    Alert.alert(
      t('account.subscriptions.cancelTitle') || 'Cancelar suscripción',
      t('account.subscriptions.cancelConfirm') ||
        '¿Deseas cancelar tu suscripción?',
      [
        {
          text: t('account.buttons.cancel') || 'Cancelar',
          style: 'cancel',
        },
        {
          text: t('account.buttons.confirm') || 'Confirmar',
          onPress: async () => {
            try {
              const result = await peticiondecancelarplan();

              // Si el backend devuelve un mensaje amigable, mostrarlo
              if (result?.message) {
                Alert.alert(result.message);
              } else {
                Alert.alert(
                  t('account.subscriptions.cancelled') ||
                    'Suscripción cancelada',
                );
              }
            } catch (error) {
              console.error('Error cancelling subscription:', error);
              Alert.alert(
                t('account.subscriptions.cancelError') ||
                  'No se pudo cancelar la suscripción. Inténtalo de nuevo más tarde.',
              );
            }
          },
        },
      ],
    );
  };

  // Llamada centralizada para cancelar (programar cancel_at_period_end)
  // Retorna el JSON devuelto por el endpoint y actualiza subscriptionData si viene
  const peticiondecancelarplan = async () => {
    const headers: any = {'Content-Type': 'application/json'};
    if (token) {
      headers.Authorization = `Token ${token}`;
    }

    try {
      const body = JSON.stringify({cancel_at_period_end: true});
      const response = await fetchWithTimeout(
        '/api/payments/subscriptions/cancel/',
        {
          method: 'POST',
          headers,
          body,
        },
      );

      if (!response.ok) {
        const text = await response.text().catch(() => null);
        throw new Error(text || 'Network response was not ok');
      }

      const data = await response.json();

      // Ejemplo de respuesta:
      // {
      //   status: 'success',
      //   message: 'Tu suscripción se cancelará el 07/11/2025',
      //   subscription: { id: '...', status: 'active', cancel_at_period_end: true }
      // }

      if (data?.subscription) {
        // actualizar subscriptionData para reflejar el nuevo estado
        setSubscriptionData((prev: any) => ({
          ...(prev ?? {}),
          has_subscription: true,
          subscription: data.subscription,
        }));
      }

      return data;
    } catch (err) {
      throw err;
    }
  };

  const settings: SettingOption[] = [
    {
      icon: Bell,
      label: t('account.content.notifications'),
      onPress: () => {
        requestNotificationPermission();
      },
    },
    {
      icon: Star,
      label: t('account.content.subscription'),
      onPress: async () => {
        // fetch subscription info and then open modal
        try {
          setSubscriptionLoading(true);
          const headers: any = {'Content-Type': 'application/json'};
          if (token) {
            headers.Authorization = `Token ${token}`;
          }

          const response = await fetchWithTimeout(
            '/api/payments/my-subscription/',
            {
              method: 'GET',
              headers,
            },
          );
          if (!response.ok) {
            const text = await response.text().catch(() => null);
            throw new Error(text || 'Network response was not ok');
          }
          const data = await response.json();
          setSubscriptionData(data);
          setShowSubscriptionModal(true);
        } catch (error) {
          console.error('Error fetching subscription info:', error);
          Alert.alert(
            t('subscription.error.title') || 'Error',
            t('subscription.error.subtitle') ||
              'Could not load subscription info',
          );
        } finally {
          setSubscriptionLoading(false);
        }
      },
    },
    // Si el usuario es el administrador, no muestra el chat con admin
    ...(user?.role !== 'admin'
      ? [
          {
            icon: CircleHelp,
            label: t('account.content.contact'),
            onPress: async () => {
              try {
                const response = await fetchWithTimeout(
                  '/api/v1/chat/messages/support/',
                );

                if (!response.ok) {
                  throw new Error('Network response was not ok');
                }

                const data = await response.json();
                const supportUser = data.supportUser;

                navigation.navigate('Chat', {
                  id: supportUser.id,
                  name: supportUser.username,
                  avatar: buildMediaUrl(supportUser.avatar),
                  role: supportUser.role,
                });
              } catch (error) {
                console.error('Error fetching support user:', error);
              }
            },
          },
        ]
      : []),
    // Mostrar la opción de cancelar sólo si hay suscripción activa y
    // no está programada para cancelar al final del periodo.
    ...(subscriptionData?.has_subscription &&
    !subscriptionData?.subscription?.cancel_at_period_end
      ? [
          {
            icon: X,
            label: t('account.content.cancelSubscription'),
            onPress: () => {
              AlertCancelarSuscripcion();
            },
          },
        ]
      : []),

    ...(userType === 'coach'
      ? [
          {
            icon: User,
            label: t('account.content.myReferrals') || 'My Referrals',
            onPress: () => {
              // Abrir modal de referidos
              setShowReferralsModal(true);
            },
          },
        ]
      : []),
  ];

  const handleSignOut = async () => {
    await logout();
  };

  return (
    <View style={styles.container}>
      {/* HEADER SECTION */}
      <View style={[styles.headerContainer, {marginTop: height * 0.008}]}>
        <Image
          source={
            user?.studentProfileImage
              ? {uri: user.studentProfileImage}
              : require('../../../assets/img/userGeneric.png')
          }
          style={styles.avatar}
        />
        <View style={styles.nameContainer}>
          <Text style={styles.nameText}>{user?.username}</Text>
          <TouchableOpacity
            onPress={() => (navigation as any).navigate('EditProfile')}>
            <Text style={styles.editProfileText}>
              {t('account.titles.editProfile')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* BUTTON SECTION */}
      <View style={[styles.buttonContainer, {marginTop: height * 0.04}]}>
        {userType !== 'coach' && (
          <TouchableOpacity
            style={[styles.button, styles.highlightButton]}
            onPress={() => setShowHighlightModal(true)}>
            <Text style={styles.highlightButtonText}>
              {t('account.buttons.highlight')}
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[
            styles.button,
            styles.shareButton,
            styles.shareButtonDisabled,
          ]}
          disabled={true}
          accessibilityState={{disabled: true}}>
          <Text style={styles.shareButtonText}>
            ({t('account.buttons.comingSoon')}){' '}
            {t('account.buttons.shareTheApp')}
          </Text>
        </TouchableOpacity>
      </View>

      {/* MAIN SECTION */}
      <View
        style={[
          styles.mainSectionContainer,
          {marginTop: height * 0.06, gap: height * 0.03},
        ]}>
        {settings.map((setting, idx) => (
          <SettingItem key={idx} {...setting} />
        ))}
      </View>

      {/* FOOTER */}
      <View style={[styles.signOutButtonContainer, {bottom: height * 0.04}]}>
        <TouchableOpacity
          style={[styles.button, styles.signOutButton]}
          onPress={handleSignOut}>
          <View style={styles.signOutButtonContent}>
            <Power size={18} style={styles.icon} />
            <Text style={styles.signOutButtonText}>
              {t('account.buttons.signOut')}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <HighlightModal
        visible={showHighlightModal}
        onClose={() => setShowHighlightModal(false)}
      />

      <SubscriptionStatusModal
        visible={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
        subscriptionInfo={subscriptionData}
      />

      <MyReferralsModal
        visible={showReferralsModal}
        onClose={() => setShowReferralsModal(false)}
        referralLink={`https://showtime.app/referral/${
          user?.id ?? user?.username ?? 'ABC123'
        }`}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  nameContainer: {
    flexDirection: 'column',
  },
  nameText: {
    fontFamily: 'AnonymousPro-Bold',
    fontWeight: '700',
    fontSize: 25,
    color: '#FFFFFF',
  },
  editProfileText: {
    fontFamily: 'AnonymousPro-Regular',
    fontWeight: '400',
    fontSize: 18,
    color: '#FFFFFF',
  },
  buttonContainer: {
    flexDirection: 'column',
    width: '100%',
    gap: 25,
  },
  button: {
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
  },
  highlightButton: {
    backgroundColor: '#2B80BE',
  },
  highlightButtonText: {
    fontFamily: 'AnonymousPro-Bold',
    fontWeight: '700',
    fontSize: 16,
    color: '#FFFFFF',
  },
  shareButton: {
    borderColor: '#FFFFFF',
    borderWidth: 1.5,
  },
  shareButtonDisabled: {
    opacity: 0.5,
  },
  shareButtonText: {
    fontFamily: 'AnonymousPro-Bold',
    fontWeight: '700',
    fontSize: 16,
    color: '#FFFFFF',
  },
  mainSectionContainer: {
    flexDirection: 'column',
    paddingHorizontal: 10,
  },
  mainSectionLine: {
    flexDirection: 'row',
    gap: 20,
  },
  mainSectionText: {
    fontFamily: 'AnonymousPro-Regular',
    fontWeight: '400',
    fontSize: 18,
    color: '#FFFFFF',
  },
  icon: {
    color: '#FFFFFF',
    backgroundColor: '#252A30',
  },
  signOutButtonContainer: {
    position: 'absolute',
    width: '100%',
    alignSelf: 'center',
  },
  signOutButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  signOutButton: {
    backgroundColor: '#252A30',
  },
  signOutButtonText: {
    fontFamily: 'AnonymousPro-Bold',
    fontWeight: '700',
    fontSize: 18,
    color: '#FFFFFF',
  },
});
