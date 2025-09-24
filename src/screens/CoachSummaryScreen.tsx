import React, { useState } from 'react';
import { View, Text, Alert, StyleSheet, ActivityIndicator, Image, ScrollView} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRegistration } from '../context/RegistrationContext';
import { X } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';
import { useTranslation } from 'react-i18next';
import ImagePickerModal from '../components/modals/ImagePickerModal';

export default function CoachSummaryScreen() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const { data, resetData, updateData } = useRegistration();
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);

  const handleImagePicked = (image: { path: string }) => {
    updateData({ profileImage: image.path });
  };

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
      <Text style={styles.title}>{t('registration.readyToCoach')}</Text>

      {/* Main Card */}
      <View style={styles.cardContainer}>
          <LinearGradient
          colors={['#252A30', '#252A30']}
          style={styles.card}
          >
          {/* Profile Image */}
          <View style={styles.profileSection}>
              <TouchableOpacity style={styles.wrapper} onPress={()=> setModalVisible(true)}>
                {/* Imagen de perfil */}
                <Image
                  source={
                    data.profileImage
                      ? { uri: data.profileImage }
                      : require('../../assets/img/userGeneric.png') //imagen local
                  }
                  style={styles.profileImage}
                />
                
                
                {/* Círculo interior */}
                <Image
                  source={require('../../assets/img/ellipse36.png')}
                  style={styles.innerCircle}
                />

                {/* Círculo exterior */}
                <Image
                  source={require('../../assets/img/ellipse37.png')}
                  style={styles.outerCircle}
                />
              </TouchableOpacity> 
              <View style = {styles.nameContainer}>
                  <Text style={styles.username}>{data.username || t('registration.username')}</Text>
                  <Text style={styles.coachingRole}>{t(`coachingRoles.${data.coachingRole}`) || "Coaching Role" }</Text>    
              </View>                           
          </View>

          <ScrollView>
              <View>
                  {/* Bio */}
                  <View>
                      <Text style={styles.bioText}>{data.bio || "Coach Bio" }</Text>
                  </View>

                  {/* Accomplishments */}
                    <View style={styles.accomplishmentsContainer}>
                      <Text style = {styles.accomplishmentTitle}>{t('registration.accomplishments')}</Text>
                      {data.accomplishments && 
                          data.accomplishments.map((item, index) => (                          
                          <View key={index} style={styles.accomplishmentItem}>
                            <Text style={styles.bullet}>•</Text>
                            <Text style={styles.itemText}>{item}</Text>
                          </View>
                          ))
                      }
                  </View> 
              </View>        
          </ScrollView>
          

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
      
      <ImagePickerModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onImagePicked={handleImagePicked}
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
  },
  startButtonText: {
    fontFamily: 'AnonymousPro-Bold',
    fontSize: 18,
    fontWeight: '700',
    color: '#4A90E2',
  },
});