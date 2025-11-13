import React, {useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useRegistration} from '../context/RegistrationContext';
import {useAuth} from '../context/AuthContext';
import {X, Check} from 'lucide-react-native';
import {TouchableOpacity} from 'react-native';
import {LinearGradient} from 'react-native-linear-gradient';
import {useTranslation} from 'react-i18next';
import ImagePickerModal from '../components/modals/ImagePickerModal';
import PopupAlert from '../components/modals/PopupAlert';
import API_BASE_URL from '../config/api';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

export default function SummaryScreen() {
  const {t} = useTranslation();
  const insets = useSafeAreaInsets();
  const {login} = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const {data, resetData, updateData} = useRegistration();
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const endpoint = `${API_BASE_URL}/api/auth/register`;

  const handleImagePicked = (image: {
    path: string;
    mime: string;
    filename: string;
  }) => {
    updateData({
      studentProfileImage: image.path.startsWith('file://')
        ? image.path
        : `file://${image.path}`,
      studentProfileImageMime: image.mime || 'image/jpeg',
      studentProfileImageName: image.filename || 'profile.jpg',
    });
  };

  const handleFinishRegistration = async () => {
    setIsLoading(true);
    //No envia campos vacios (asi excluye los del coach)
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== undefined),
    );

    try {
      // Registration process
      const formData = new FormData();
      // Añadir campos de texto
      Object.entries(cleanData).forEach(([key, value]) => {
        // Si el valor es un objeto, conviértelo a JSON string
        if (typeof value === 'object' && value !== null) {
          formData.append(key, JSON.stringify(value));
        } else if (value !== undefined) {
          formData.append(key, value as string);
        }
      });

      // Añadir imagen si existe
      if (data.studentProfileImage) {
        formData.append('studentProfileImage', {
          uri: data.studentProfileImage,
          type: data.studentProfileImageMime || 'image/jpeg',
          name: data.studentProfileImageName || 'profile.jpg',
        });
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          // NO poner 'Content-Type', fetch lo pone automáticamente
          // y calcula correctamente los límites del multipart/form-data
        },
        body: formData,
      });

      let result;
      try {
        result = await response.json();
      } catch {
        throw new Error(
          `${t('common.registrationFailed')}. ${t('errors.tryAgain')}`,
        );
      }

      // validar si la respuesta fue exitosa
      if (!response.ok) {
        throw new Error(
          result?.error ||
            `${t('common.registrationFailed')}. ${t('errors.tryAgain')}`,
        );
      }

      // guarda datos en AuthContext
      const {token, user} = result;
      await login(token, {
        id: user.id,
        username: user.username,
        role: user.role,
        position: user.position,
        physicalData: user.physicalData,
        studentProfileImage: user.studentProfileImage
          ? `${API_BASE_URL}/media/${user.studentProfileImage}`
          : '',
      });

      // Reset registration data after successful registration
      resetData();

      // Pequeño delay para asegurar que el contexto de auth esté actualizado
      await new Promise<void>(resolve => setTimeout(() => resolve(), 100));

      // Navigate to subscription flow after successful account creation
      (navigation as any).reset({
        index: 0,
        routes: [{name: 'Plans'}],
      });
    } catch (error: any) {
      if (error.message === 'Network request failed') {
        setErrorMessage(
          t('errors.networkError') || t('errors.serverConnection'),
        );
      } else {
        setErrorMessage(
          error?.message ||
            `${t('common.registrationFailed')}. ${t('errors.tryAgain')}`,
        );
      }
      setErrorModalVisible(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    (navigation as any).goBack();
  };

  const calculateAge = () => {
    if (!data.dateOfBirth) {
      return t('common.na');
    }
    const today = new Date();
    const birthDate = new Date(
      data.dateOfBirth.year,
      data.dateOfBirth.month - 1,
      data.dateOfBirth.day,
    );
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const getTrainingFrequencyShort = () => {
    if (!data.trainingFrequency) {
      return t('common.na');
    }
    if (data.trainingFrequency.includes('3-5')) {
      return '3-5';
    }
    if (data.trainingFrequency.includes('5-7')) {
      return '5-7';
    }
    if (data.trainingFrequency.includes('+7')) {
      return '+7';
    }
    return t('common.na');
  };

  return (
    <SafeAreaView style={[styles.container, {paddingTop: insets.top}]}>
      {/* Main content: unified top bar + card inside the same ScrollView to avoid split sections */}
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {paddingBottom: insets.bottom + 40},
        ]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <X color="#fff" size={24} />
          </TouchableOpacity>
          <Text style={styles.topBarTitle}>
            {t('registration.readyToPlay')}
          </Text>
        </View>

        <View style={styles.cardContainer}>
          <LinearGradient colors={['#4A90E2', '#357ABD']} style={styles.card}>
            {/* Profile Image */}
            <View style={styles.profileSection}>
              <View style={styles.profileImageContainer}>
                <TouchableOpacity
                  style={styles.wrapper}
                  onPress={() => setModalVisible(true)}>
                  {/* Imagen de perfil */}
                  <View style={styles.profileImageBorder}>
                    <Image
                      source={
                        data.studentProfileImage
                          ? {uri: data.studentProfileImage}
                          : require('../../assets/img/upload_user.png') //imagen local
                      }
                      style={styles.profileImage}
                    />
                  </View>
                </TouchableOpacity>
              </View>

              <Text style={styles.username}>
                {data.username || t('registration.username')}
              </Text>
              <Text style={styles.age}>
                {calculateAge()} {t('units.years')}
              </Text>
            </View>

            {/* Info Grid */}
            <View style={styles.infoGrid}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>{t('summary.weight')}</Text>
                <Text style={styles.infoValue}>
                  {data.physicalData?.height
                    ? `${data.physicalData.height} ${t('units.cm')}`
                    : t('common.na')}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>{t('summary.height')}</Text>
                <Text style={styles.infoValue}>
                  {data.physicalData?.weight
                    ? `${data.physicalData.weight} ${t('units.kg')}`
                    : t('common.na')}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>
                  {t('registration.citizenship')}
                </Text>
                <Text style={styles.infoValue}>
                  {data.citizenship || t('common.na')}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>
                  {t('summary.playingPosition')}
                </Text>
                <Text style={styles.infoValue}>
                  {data.position || t('common.na')}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>
                  {t('registration.experienceLevel')}
                </Text>
                <Text style={styles.infoValue}>
                  {data.experienceLevel || t('common.na')}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>
                  {t('registration.trainingFrequency')}
                </Text>
                <Text style={styles.infoValue}>
                  {getTrainingFrequencyShort()}
                </Text>
              </View>
            </View>

            {/* All Set Button */}
            <View style={styles.allSetButton}>
              <Text style={styles.allSetText}>{t('summary.allSet')}</Text>
              <View style={styles.checkIcon}>
                <Check color="#4A90E2" size={16} strokeWidth={3} />
              </View>
            </View>

            {/* Start Button */}
            <TouchableOpacity
              style={styles.startButton}
              onPress={handleFinishRegistration}
              disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator color="#4A90E2" size="small" />
              ) : (
                <Text style={styles.startButtonText}>{t('common.start')}</Text>
              )}
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </ScrollView>
      <ImagePickerModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onImagePicked={handleImagePicked}
      />
      <PopupAlert
        visible={errorModalVisible}
        message={errorMessage}
        onClose={() => setErrorModalVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 20,
  },
  header: {
    paddingTop: 30,
  },
  topBar: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    position: 'relative',
  },
  topBarTitle: {
    fontFamily: 'AnonymousPro-Bold',
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
  },
  scrollContent: {
    paddingBottom: 30,
    flexGrow: 1, // para que el ScrollView tome el espacio mínimo necesario
  },
  closeButton: {
    width: 32,
    height: 32,
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: 0,
    top: 12,
  },
  title: {
    fontFamily: 'AnonymousPro-Bold',
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 50,
    marginTop: 15,
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  card: {
    borderRadius: 30,
    width: '100%',
    paddingHorizontal: 10,

    alignItems: 'center',
    shadowColor: '#4A90E2',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImageContainer: {
    marginBottom: 20,
    marginTop: 30,
  },
  wrapper: {
    width: 150,
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImageBorder: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    padding: 10,
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 56,
  },
  username: {
    fontFamily: 'AnonymousPro-Bold',
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  age: {
    fontFamily: 'AnonymousPro-Regular',
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  infoGrid: {
    width: '85%',
    marginBottom: 30,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  infoLabel: {
    fontFamily: 'AnonymousPro-Regular',
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    flex: 1,
  },
  infoValue: {
    fontFamily: 'AnonymousPro-Regular',
    fontSize: 16,
    color: '#fff',
    textAlign: 'right',
    flex: 1,
  },
  allSetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    width: '85%',
    marginBottom: 16,
  },
  allSetText: {
    fontFamily: 'AnonymousPro-Regular',
    fontSize: 16,
    color: '#fff',
    flex: 1,
  },
  checkIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButton: {
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingVertical: 20,
    width: '85%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 20,
  },
  startButtonText: {
    fontFamily: 'AnonymousPro-Bold',
    fontSize: 24,
    fontWeight: '700',
    color: '#4A90E2',
  },
});
