import React from 'react';
import { ScrollView, Button, View, StyleSheet, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function DebugNavigator() {
  const navigation = useNavigation();

  const screens = [
    'CoachesTabScreen',    
    'CustomSplash',    
    'RegisterMethod',    
    'CreateAccount',
    'SelectRole',
    'Username',
    'Gender',
    'DateOfBirth',
    'Citizenship',
    'PhysicalData',
    'PhysicalGoal',
    'Position',
    'ExperienceLevel',
    'TrainingFrequency',
    'ContentLikes',
    'AppDiscovery',
    'Notifications',    
    'Summary',
    'CoachSummary',
    'PlanSelection',
    'Home',
    'SubscribeBasic',
    'SubscribePremium',
    'SubscribeElite',
    'Carousel',
    'PublishPost',
    'Account',
    'CoachingRole',
    'UploadMedia',
    'WriteBio',
    'Accomplishments',
    'EditProfile'    
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Debug Navigator</Text>
      {screens.map((screen) => (
        <View key={screen} style={styles.buttonContainer}>
          <Button
            title={`Ir a ${screen}`}
            onPress={() => navigation.navigate(screen)}
          />
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    marginBottom: 10,
  },
});
