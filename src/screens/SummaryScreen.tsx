import React, { useState } from 'react';
import { View, Text, Alert, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRegistration } from '../context/RegistrationContext';
import { X, Check } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';
import { useTranslation } from 'react-i18next';

export default function SummaryScreen() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const { data, resetData } = useRegistration();
  const navigation = useNavigation();

  const handleFinishRegistration = async () => {
    setIsLoading(true);

    try {
      // Simulate registration process
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Reset registration data after successful registration
      resetData();

      // Navigate to home/dashboard
      (navigation as any).navigate('Home');

    } catch (error) {
      console.error('Registration failed:', error);
      Alert.alert(
        t('common.registrationFailed'),
        t('errors.tryAgain'),
        [{ text: t('common.ok') }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    (navigation as any).goBack();
  };

  const calculateAge = () => {
    if (!data.dateOfBirth) {return t('common.na');}
    const today = new Date();
    const birthDate = new Date(data.dateOfBirth.year, data.dateOfBirth.month - 1, data.dateOfBirth.day);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const getTrainingFrequencyShort = () => {
    if (!data.trainingFrequency) {return t('common.na');}
    if (data.trainingFrequency.includes('3-5')) {return '3-5';}
    if (data.trainingFrequency.includes('5-7')) {return '5-7';}
    if (data.trainingFrequency.includes('+7')) {return '+7';}
    return t('common.na');
  };

  return (
    <View style={styles.container}>
      {/* Header with close button */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={handleClose}
        >
          <X color="#fff" size={24} />
        </TouchableOpacity>
      </View>

      {/* Title */}
      <Text style={styles.title}>{t('registration.readyToPlay')}</Text>

      {/* Main Card */}
      <View style={styles.cardContainer}>
        <LinearGradient
          colors={['#4A90E2', '#357ABD']}
          style={styles.card}
        >
          {/* Profile Image */}
          <View style={styles.profileSection}>
            <View style={styles.profileImageContainer}>
              <View style={styles.profileImageBorder}>
                <Image
                  source={{ uri: 'https://img.freepik.com/free-photo/portrait-white-man-isolated_53876-40306.jpg?semt=ais_hybrid&w=740' }}
                  style={styles.profileImage}
                />
              </View>
            </View>

            <Text style={styles.username}>{data.username || t('registration.username')}</Text>
            <Text style={styles.age}>{calculateAge()} {t('units.years')}</Text>
          </View>

          {/* Info Grid */}
          <View style={styles.infoGrid}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{t('summary.weight')}</Text>
              <Text style={styles.infoValue}>
                {data.physicalData?.height ? `${data.physicalData.height} ${t('units.cm')}` : t('common.na')}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{t('summary.height')}</Text>
              <Text style={styles.infoValue}>
                {data.physicalData?.weight ? `${data.physicalData.weight} ${t('units.kg')}` : t('common.na')}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{t('registration.citizenship')}</Text>
              <Text style={styles.infoValue}>{data.citizenship || t('common.na')}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{t('summary.playingPosition')}</Text>
              <Text style={styles.infoValue}>{data.position || t('common.na')}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{t('registration.experienceLevel')}</Text>
              <Text style={styles.infoValue}>{data.experienceLevel || t('common.na')}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{t('registration.trainingFrequency')}</Text>
              <Text style={styles.infoValue}>{getTrainingFrequencyShort()}</Text>
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
    borderRadius: 30,
    padding: 30,
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
  },
  profileImageBorder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    padding: 4,
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
    width: '100%',
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
  },
  startButtonText: {
    fontFamily: 'AnonymousPro-Bold',
    fontSize: 18,
    fontWeight: '700',
    color: '#4A90E2',
  },
});

