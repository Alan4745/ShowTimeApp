import React, { useState } from 'react';
import { View, Text, ScrollView, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRegistration } from '../context/RegistrationContext';
import ScreenLayout from '../components/common/ScreenLayout';
import ContentContainer from '../components/common/ContentContainer';
import BottomSection from '../components/common/BottomSection';
import ContinueButton from '../components/common/ContinueButton';
import { User, Dumbbell, Trophy, Heart, CreditCard } from 'lucide-react-native';

export default function SummaryScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const { data, resetData } = useRegistration();
  const navigation = useNavigation();

  const handleFinishRegistration = async () => {
    setIsLoading(true);

    try {
      // Simulate API call to register user
      const registrationData = {
        authMethod: data.authMethod,
        email: data.email,
        username: data.username,
        gender: data.gender,
        dateOfBirth: data.dateOfBirth,
        citizenship: data.citizenship,
        physicalData: data.physicalData,
        physicalGoal: data.physicalGoal,
        position: data.position,
        experienceLevel: data.experienceLevel,
        trainingFrequency: data.trainingFrequency,
        contentLikes: data.contentLikes,
        notificationsEnabled: data.notificationsEnabled,
        appDiscoverySource: data.appDiscoverySource,
        selectedPlan: data.selectedPlan,
        registrationDate: new Date().toISOString(),
      };

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Here you would make the actual API call
      // const response = await fetch('/api/register', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(registrationData)
      // });

      console.log('Registration Data:', JSON.stringify(registrationData, null, 2));

      // Reset registration data after successful registration
      resetData();

      // Navigate to home/dashboard
      (navigation as any).navigate('Home');

    } catch (error) {
      console.error('Registration failed:', error);
      Alert.alert(
        'Registration Failed',
        'There was an error completing your registration. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateObj: any) => {
    if (!dateObj) {return 'Not specified';}
    return `${dateObj.month}/${dateObj.day}/${dateObj.year}`;
  };

  const getAuthMethodDisplay = (method: string) => {
    switch (method) {
      case 'google': return 'Google';
      case 'apple': return 'Apple';
      case 'email': return 'Email';
      default: return 'Unknown';
    }
  };

  return (
    <ScreenLayout currentStep={14} totalSteps={14} showBackButton={true}>
      <ContentContainer centered={false} style={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Welcome,</Text>
          <Text style={styles.usernameText}>{data.username || 'Athlete'}</Text>
          <Text style={styles.subtitleText}>Profile Summary</Text>
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.summaryCard}>
            {/* Personal Info */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <User color="#4A90E2" size={20} />
                <Text style={styles.sectionTitle}>Personal Information</Text>
              </View>
              <View style={styles.infoGrid}>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Gender:</Text>
                  <Text style={styles.infoValue}>{data.gender || 'Not specified'}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Age:</Text>
                  <Text style={styles.infoValue}>
                    {data.dateOfBirth ?
                      new Date().getFullYear() - data.dateOfBirth.year :
                      'Not specified'
                    }
                  </Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Date of Birth:</Text>
                  <Text style={styles.infoValue}>{formatDate(data.dateOfBirth)}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Citizenship:</Text>
                  <Text style={styles.infoValue}>{data.citizenship || 'Not specified'}</Text>
                </View>
              </View>
            </View>

            {/* Athletic Profile */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Trophy color="#4A90E2" size={20} />
                <Text style={styles.sectionTitle}>Athletic Profile</Text>
              </View>
              <View style={styles.infoGrid}>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Position:</Text>
                  <Text style={styles.infoValue}>{data.position || 'Not specified'}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Experience:</Text>
                  <Text style={styles.infoValue}>{data.experienceLevel || 'Not specified'}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Training Frequency:</Text>
                  <Text style={styles.infoValue}>{data.trainingFrequency || 'Not specified'}</Text>
                </View>
              </View>
            </View>

            {/* Physical Data */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Dumbbell color="#4A90E2" size={20} />
                <Text style={styles.sectionTitle}>Physical Data & Goals</Text>
              </View>
              <View style={styles.infoGrid}>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Height:</Text>
                  <Text style={styles.infoValue}>
                    {data.physicalData?.height ? `${data.physicalData.height}cm` : 'Not specified'}
                  </Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Weight:</Text>
                  <Text style={styles.infoValue}>
                    {data.physicalData?.weight ? `${data.physicalData.weight}kg` : 'Not specified'}
                  </Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Goal:</Text>
                  <Text style={styles.infoValue}>{data.physicalGoal || 'Not specified'}</Text>
                </View>
              </View>
            </View>

            {/* Preferences */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Heart color="#4A90E2" size={20} />
                <Text style={styles.sectionTitle}>Preferences</Text>
              </View>
              <View style={styles.infoGrid}>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Content Interests:</Text>
                  <Text style={styles.infoValue}>
                    {data.contentLikes?.length ? `${data.contentLikes.length} selected` : 'None selected'}
                  </Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Notifications:</Text>
                  <Text style={styles.infoValue}>
                    {data.notificationsEnabled ? 'Enabled' : 'Disabled'}
                  </Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Found us via:</Text>
                  <Text style={styles.infoValue}>{data.appDiscoverySource || 'Not specified'}</Text>
                </View>
              </View>
            </View>

            {/* Selected Plan */}
            {data.selectedPlan && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <CreditCard color="#4A90E2" size={20} />
                  <Text style={styles.sectionTitle}>Selected Plan</Text>
                </View>
                <View style={styles.planInfo}>
                  <Text style={styles.planTitle}>{data.selectedPlan.title}</Text>
                  <Text style={styles.planPrice}>{data.selectedPlan.price}</Text>
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      </ContentContainer>

      <BottomSection>
        <ContinueButton
          onPress={handleFinishRegistration}
          disabled={isLoading}
          title={isLoading ? 'Creating Account...' : 'Start Training!'}
          style={isLoading ? styles.loadingButton : undefined}
        />
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color="#4A90E2" size="small" />
            <Text style={styles.loadingText}>Setting up your personalized experience...</Text>
          </View>
        )}
      </BottomSection>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingTop: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  usernameText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 8,
  },
  subtitleText: {
    fontSize: 18,
    color: '#999',
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  summaryCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    padding: 20,
    gap: 24,
  },
  section: {
    gap: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  infoGrid: {
    gap: 12,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  infoLabel: {
    fontSize: 14,
    color: '#999',
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  planInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#4A90E2',
  },
  planTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  planPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  loadingButton: {
    opacity: 0.7,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 12,
  },
  loadingText: {
    color: '#999',
    fontSize: 14,
  },
});
