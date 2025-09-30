import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import CustomSplashScreen from '../screens/CustomSplashScreen';
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
import CoachesTabScreen from '../screens/CoachesTabScreen';
import SubscribeBasicScreen from '../screens/SubscribeBasicScreen';
import SubscribePremiumScreen from '../screens/SubscribePremiumScreen';
import SubscribeEliteScreen from '../screens/SubscribeEliteScreen';
import CarouselScreen from '../screens/CarouselScreen';
import StudentPostScreen from '../screens/StudentPostScreen';
import DebugNavigator from './DebugNavigator';
import PublishPostScreen from '../screens/PublishPostScreen';
import CoachDetailsScreen from '../screens/CoachDetailsScreen';
import AccountScreen from '../screens/AccountScreen';
import ChatScreen from '../screens/ChatScreen';
import UploadContentScreen from '../screens/UploadContentScreen';
import CoachingRoleScreen from '../screens/CoachingRoleScreen';
import UploadMediaScreen from '../screens/UploadMediaScreen';
import WriteBioScreen from '../screens/WriteBioScreen';
import AccomplishmentsScreen from '../screens/AccomplishmentsScreen';
import SelectRoleScreen from '../screens/SelectRoleScreen';
import CoachSummaryScreen from '../screens/CoachSummaryScreen';
 

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="DebugNavigator"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="DebugNavigator" component={DebugNavigator} />
        <Stack.Screen name="CoachesTabScreen" component={CoachesTabScreen} />
        <Stack.Screen name="CustomSplash" component={CustomSplashScreen} />
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
        <Stack.Screen name="Summary" component={SummaryScreen} />        
        <Stack.Screen name="CoachSummary" component={CoachSummaryScreen} />        
        <Stack.Screen name="PlanSelection" component={PlanSelectionScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />        
        <Stack.Screen name="SubscribeBasic" component={SubscribeBasicScreen} />        
        <Stack.Screen name="SubscribePremium" component={SubscribePremiumScreen} />        
        <Stack.Screen name="SubscribeElite" component={SubscribeEliteScreen} />              
        <Stack.Screen name="StudentPost" component={StudentPostScreen} /> 
        <Stack.Screen name="PublishPost" component={PublishPostScreen} /> 
        <Stack.Screen name="CoachDetails" component={CoachDetailsScreen} /> 
        <Stack.Screen name="Account" component={AccountScreen} /> 
        <Stack.Screen name="UploadContent" component={UploadContentScreen} /> 
        <Stack.Screen name="Chat" component={ChatScreen}/> 
        <Stack.Screen name="CoachingRole" component={CoachingRoleScreen}/> 
        <Stack.Screen name="UploadMedia" component={UploadMediaScreen}/> 
        <Stack.Screen name="WriteBio" component={WriteBioScreen}/> 
        <Stack.Screen name="Accomplishments" component={AccomplishmentsScreen}/> 
      </Stack.Navigator>
    </NavigationContainer>
  );
}
