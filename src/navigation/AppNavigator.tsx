import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import RegisterMethodScreen from '../screens/RegisterMethodScreen';
import CreateAccountScreen from '../screens/CreateAccountScreen';
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
import SummaryScreen from '../screens/SummaryScreen';
import PlanSelectionScreen from '../screens/PlanSelectionScreen';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
// import CustomSplashScreen from '../screens/CustomSplashScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="RegisterMethod"
        screenOptions={{ headerShown: false }}
      >
        {/* <Stack.Screen name="CustomSplash" component={CustomSplashScreen} /> */}
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="RegisterMethod" component={RegisterMethodScreen} />
        <Stack.Screen name="CreateAccount" component={CreateAccountScreen} />
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
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
        <Stack.Screen name="AppDiscovery" component={AppDiscoveryScreen} />
        <Stack.Screen name="Summary" component={SummaryScreen} />
        <Stack.Screen name="PlanSelection" component={PlanSelectionScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
