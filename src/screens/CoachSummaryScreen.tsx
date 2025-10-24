import React, { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRegistration } from '../context/RegistrationContext';
import { useAuth } from '../context/AuthContext';
import { X } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';
import { useTranslation } from 'react-i18next';
import ImagePickerModal from '../components/modals/ImagePickerModal';
import PopupAlert from '../components/modals/PopupAlert';
import API_BASE_URL from '../config/api';
import { fetchWithTimeout } from '../utils/fetchWithTimeout';
import { buildMediaUrl } from '../utils/urlHelpers';

export default function CoachSummaryScreen() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { data, resetData, updateData } = useRegistration();
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const endpoint = '/api/auth/register';

  const handleImagePicked = (image: { path: string; mime?: string; filename?: string }) => {
    updateData({
      studentProfileImage: image.path.startsWith('file://') ? image.path : `file://${image.path}`,
      studentProfileImageMime: image.mime || 'image/jpeg',
      studentProfileImageName: image.filename || 'profile.jpg',
    });
  };


  const handleFinishRegistration = async () => {
    setIsLoading(true);
    let success = false;
    try {    
      

      // Paso 1️⃣ — Registro base
      const formData = new FormData();
      const cleanData = Object.fromEntries(Object.entries(data).filter(([_, v]) => v !== undefined));

      Object.entries(cleanData).forEach(([key, value]) => {
        if (typeof value === 'object' && value !== null && key !== 'dateOfBirth') {
          formData.append(key, JSON.stringify(value));
        } else if (key === 'dateOfBirth' && value) {
          formData.append('dateOfBirth', JSON.stringify(value));
        } else {
          formData.append(key, value as any);
        }
      });

      // Imagen de perfil opcional
      if (data.studentProfileImage) {        
        formData.append('studentProfileImage', {
          uri: data.studentProfileImage,
          type: data.studentProfileImageMime || 'image/jpeg',
          name: data.studentProfileImageName || 'profile.jpg',
        } as any);
      }

      // Registro principal
      const response = await fetchWithTimeout('/api/auth/register', {
        method: 'POST',
        body: formData,
      }, 120000);

      const result = await response.json();
      if (!response.ok) {
        console.error('❌ Error en registro:', result);
        throw new Error(result.error || 'Registration failed');
      }

      // guarda datos en AuthContext
      const {token, user} = result;
      await login(token, {
        id: user.id,
        username: user.username,
        role: user.role,        
        studentProfileImage: user.studentProfileImage
          ? buildMediaUrl(user.studentProfileImage)
          : "",
      });

      // Paso 2️⃣ — Si es coach, actualizar campos específicos
      if (data.role === 'coach') {
        const coachForm = new FormData();

        // 🔹 Mapear el coachingRole al formato esperado por el backend
        const roleMap: Record<string, string> = {
          performanceCoach: 'Performance Coach',
          nutrition: 'Nutrition',
          gameAnalysis: 'Game Analysis',
          drillTechnical: 'Drill/Technical',
          mindset: 'Mindset',
        };

        const mappedRole = data.coachingRole && roleMap[data.coachingRole]
          ? roleMap[data.coachingRole]
          : data.coachingRole || '';
          
        if (mappedRole) coachForm.append('coachingRole', mappedRole);        
        if (data.bio) coachForm.append('coachBiography', data.bio);
        if (data.accomplishments && data.accomplishments.length > 0) {
          coachForm.append('coachAchievements', JSON.stringify(data.accomplishments));
        }

        if (data.coachMedia) {
          coachForm.append('coachMediaFile', {
            uri: data.coachMedia.startsWith('file://') ? data.coachMedia : `file://${data.coachMedia}`,
            type: data.coachMediaFileMime || 'video/mp4',
            name: data.coachMediaFileName || 'coach_media.mp4',
          } as any);
        }

        const coachResponse = await fetchWithTimeout('/api/coach/profile', {
          method: 'PATCH',
          body: coachForm,
        }, 500000);

        const coachResult = await coachResponse.json();
        if (!coachResponse.ok) {
          console.error('❌ Error al actualizar coach:', coachResult);
          throw new Error(coachResult.error || 'Coach update failed');
        }

        success = true;
      }     
    } catch (error: any) {
      console.error('❌ Error en registro de coach:', error);
      Alert.alert('Error', error.message || 'No se pudo completar el registro');
    } finally {
      setIsLoading(false);      
      if (success) {
        await new Promise<void>(resolve => setTimeout(resolve, 500)); // pequeña espera opcional
        resetData();
        (navigation as any).navigate('Home');
      }  
    }
  };

  const handleClose = () => {
    (navigation as any).goBack();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
          <X color="#fff" size={24} />
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>{t('registration.readyToCoach')}</Text>

      <View style={styles.cardContainer}>
        <LinearGradient colors={['#252A30', '#252A30']} style={styles.card}>
          {/* Profile */}
          <View style={styles.profileSection}>
            <TouchableOpacity style={styles.wrapper} onPress={() => setModalVisible(true)}>
              <Image
                source={data.studentProfileImage ? { uri: data.studentProfileImage } : require('../../assets/img/userGeneric.png')}
                style={styles.profileImage}
              />
              <Image source={require('../../assets/img/ellipse36.png')} style={styles.innerCircle} />
              <Image source={require('../../assets/img/ellipse37.png')} style={styles.outerCircle} />
            </TouchableOpacity>

            <View style={styles.nameContainer}>
              <Text style={styles.username}>{data.username || t('registration.username')}</Text>
              <Text style={styles.coachingRole}>
                {t(`coachingRoles.${data.coachingRole}`) || t('registration.coachingRole')}
              </Text>
            </View>
          </View>

          <ScrollView>
            {/* Bio */}
            <View>
              <Text style={styles.bioText}>{data.bio || t('registration.bioPlaceholder')}</Text>
            </View>

            {/* Accomplishments */}
            <View style={styles.accomplishmentsContainer}>
              <Text style={styles.accomplishmentTitle}>{t('registration.accomplishments')}</Text>
              {data.accomplishments?.map((item, index) => (
                <View key={index} style={styles.accomplishmentItem}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.itemText}>{item}</Text>
                </View>
              ))}
            </View>
          </ScrollView>

          {/* Start button */}
          <TouchableOpacity
            style={styles.startButton}
            onPress={handleFinishRegistration}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#4A90E2" size="small" />
            ) : (
              <Text style={styles.startButtonText}>{t('common.start')}</Text>
            )}
          </TouchableOpacity>
        </LinearGradient>
      </View>

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
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 20,
  },
  header: {
    paddingTop: 20,
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
  },
  title: {
    fontFamily: 'AnonymousPro-Bold',
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 50,
    marginTop: 0,
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 50,
  },
  card: {
    height: "95%",
    borderRadius: 30,
    padding: 30,
    alignItems: 'center',
  },
  profileSection: {
    flexDirection: "column",
    alignItems: 'center',
    marginBottom: 30,
    gap: 40
  },
  wrapper: {
    width: 150,
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImage: {
    width: 160,
    height: 160,
    borderRadius: 80,
    position: 'absolute',
    zIndex: 1,
  },
  innerCircle: {
    width: 200,
    height: 200,
    position: 'absolute',
    zIndex: 2,
    resizeMode: 'contain',
  },
  outerCircle: {
    width: 260,
    height: 260,
    position: 'absolute',
    zIndex: 0,
    resizeMode: 'contain',
  },
  nameContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"    
  },
  username: {
    fontFamily: 'AnonymousPro-Bold',
    fontWeight: '700',
    fontSize: 24,
    color: '#fff',    
  },
  coachingRole: {
    fontFamily: 'AnonymousPro-Regular',
    fontWeight: '400',
    fontSize: 20,
    color: '#fff',
    marginBottom: 4,
  },
  bioText: {
    fontFamily: 'AnonymousPro-Regular',
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 18,
    color: '#fff',
    textAlign: "justify"
  },
  accomplishmentsContainer: {
    marginTop: 10,
  },
  accomplishmentTitle: {
    fontFamily: 'AnonymousPro-Regular',
    fontWeight: '700',
    fontSize: 20,    
    color: '#fff',
    alignSelf: "center",
    marginBottom: 10,
    marginTop: 5
  },
  accomplishmentItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 2,
  },
  bullet: {
    fontFamily: 'AnonymousPro-Regular',
    fontWeight: "400",
    fontSize: 16,
    lineHeight: 20,
    paddingRight: 6,
    paddingTop: 2,
    color: "#FFFFFF",
  },
  itemText: {
    flex: 1,
    fontFamily: 'AnonymousPro-Regular',
    fontWeight: "400",
    fontSize: 16,
    lineHeight: 20,
    color: "#FFFFFF",
    marginLeft: 5
  },  
  allSetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    width: '100%',
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
    paddingVertical: 16,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    marginTop: 10,
  },
  startButtonText: {
    fontFamily: 'AnonymousPro-Bold',
    fontSize: 18,
    fontWeight: '700',
    color: '#4A90E2',
  },
});