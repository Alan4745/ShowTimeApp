import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../context/AuthContext';
import CustomSplashScreen from '../screens/CustomSplashScreen';

// PUBLICAS
import CarouselScreen from '../screens/CarouselScreen';
import RegisterMethodScreen from '../screens/RegisterMethodScreen';
import CreateAccountScreen from '../screens/CreateAccountScreen';
import SelectRoleScreen from '../screens/SelectRoleScreen';
import UsernameScreen from '../screens/UsernameScreen';
import GenderScreen from '../screens/GenderScreen';
import DateOfBirthScreen from '../screens/DateOfBirthScreen';
import CitizenshipScreen from '../screens/CitizenshipScreen';
import PhysicalDataScreen from '../screens/PhysicalDataScreen';
import PhysicalGoalScreen from '../screens/PhysicalGoalScreen';
import PositionScreen from '../screens/PositionScreen';
import ExperienceLevelScreen from '../screens/ExperienceLevelScreen';
import TrainingFrequencyScreen from '../screens/TrainingFrequencyScreen';
import ContentLikesScreen from '../screens/ContentLikesScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import AppDiscoveryScreen from '../screens/AppDiscoveryScreen';
import CoachingRoleScreen from '../screens/CoachingRoleScreen';
import SummaryScreen from '../screens/SummaryScreen';
import PlanSelectionScreen from '../screens/PlanSelectionScreen';
import SubscribeBasicScreen from '../screens/SubscribeBasicScreen';
import SubscribePremiumScreen from '../screens/SubscribePremiumScreen';
import SubscribeEliteScreen from '../screens/SubscribeEliteScreen';
import WriteBioScreen from '../screens/WriteBioScreen';
import AccomplishmentsScreen from '../screens/AccomplishmentsScreen';
import CoachSummaryScreen from '../screens/CoachSummaryScreen';
import DebugNavigator from './DebugNavigator';

// PRIVADAS
import HomeScreen from '../screens/HomeScreen';
import StudentPostScreen from '../screens/StudentPostScreen';
import PublishPostScreen from '../screens/PublishPostScreen';
import CoachDetailsScreen from '../screens/CoachDetailsScreen';
import AccountScreen from '../screens/AccountScreen';
import ChatScreen from '../screens/ChatScreen';
import UploadContentScreen from '../screens/UploadContentScreen';
import UploadMediaScreen from '../screens/UploadMediaScreen';
import EditProfileScreen from '../screens/EditProfileScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  const { token } = useAuth();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 3000);
    return () => clearTimeout(timer);
  }, [token]); // importante: depende de token

  if (showSplash) {
    return <CustomSplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {token ? (
          // PRIVADO
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="StudentPost" component={StudentPostScreen} />
            <Stack.Screen name="PublishPost" component={PublishPostScreen} />
            <Stack.Screen name="CoachDetails" component={CoachDetailsScreen} />
            <Stack.Screen name="Account" component={AccountScreen} />
            <Stack.Screen name="UploadContent" component={UploadContentScreen} />
            <Stack.Screen name="Chat" component={ChatScreen} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
          </>
        ) : (
          // PÚBLICO
          <>
            <Stack.Screen name="Carousel" component={CarouselScreen} />
            <Stack.Screen name="RegisterMethod" component={RegisterMethodScreen} />
            <Stack.Screen name="CreateAccount" component={CreateAccountScreen} />
            <Stack.Screen name="SelectRole" component={SelectRoleScreen} />
            <Stack.Screen name="Username" component={UsernameScreen} />
            <Stack.Screen name="Gender" component={GenderScreen} />
            <Stack.Screen name="DateOfBirth" component={DateOfBirthScreen} />
            <Stack.Screen name="Citizenship" component={CitizenshipScreen} />
            <Stack.Screen name="PhysicalData" component={PhysicalDataScreen} />
            <Stack.Screen name="PhysicalGoal" component={PhysicalGoalScreen} />
            <Stack.Screen name="Position" component={PositionScreen} />
            <Stack.Screen name="ExperienceLevel" component={ExperienceLevelScreen} />
            <Stack.Screen name="TrainingFrequency" component={TrainingFrequencyScreen} />
            <Stack.Screen name="ContentLikes" component={ContentLikesScreen} />
            <Stack.Screen name="AppDiscovery" component={AppDiscoveryScreen} />
            <Stack.Screen name="Notifications" component={NotificationsScreen} />
            <Stack.Screen name="CoachingRole" component={CoachingRoleScreen} />
            <Stack.Screen name="UploadMedia" component={UploadMediaScreen} />
            <Stack.Screen name="WriteBio" component={WriteBioScreen} />
            <Stack.Screen name="Accomplishments" component={AccomplishmentsScreen} />
            <Stack.Screen name="Summary" component={SummaryScreen} />
            <Stack.Screen name="CoachSummary" component={CoachSummaryScreen} />
            <Stack.Screen name="PlanSelection" component={PlanSelectionScreen} />
            <Stack.Screen name="SubscribeBasic" component={SubscribeBasicScreen} />
            <Stack.Screen name="SubscribePremium" component={SubscribePremiumScreen} />
            <Stack.Screen name="SubscribeElite" component={SubscribeEliteScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
