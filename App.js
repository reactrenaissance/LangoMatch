import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthScreen from './frontend/authentication/authScreen/authScreen'
import LogIn from './frontend/authentication/LogIn/LogIn';
import SignUp from './frontend/authentication/SignUp/SignUp';
import Onboarding from './frontend/authentication/SignUp/Onboarding';
import Welcome from './frontend/userspace/Welcome/Welcome';
import ProfileCreation from './frontend/authentication/SignUp/ProfileCreation';
import PartnerRoulette from './frontend/userspace/PartnerRoulette/PartnerRoulette';
import ChatScreen from './frontend/userspace/ChatScreen/ChatScreen';
import SettingsScreen from './frontend/userspace/SettingsScreen/SettingsScreen';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" size={size} color={color} />
          ),
        }} name="Home" component={Welcome} />
      <Tab.Screen options={{
        headerShown: false,
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="cards" size={size} color={color} />
        ),
      }} name="Explore" component={PartnerRoulette} />
      <Tab.Screen options={{
        headerShown: false,
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="chat" size={size} color={color} />
        ),
      }} name="Chats" component={ChatScreen} />
      <Tab.Screen options={{
        headerShown: false,
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="tools" size={size} color={color} />
        ),
      }} name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Authentication Screen' screenOptions={{headerShown: false}} >
      <Stack.Screen name='Authentication Screen' component={AuthScreen}  />
      <Stack.Screen name='Log In Screen' component={LogIn} />
      <Stack.Screen name='Sign Up Screen' component={SignUp} />
      <Stack.Screen name='Onboarding' component={Onboarding} />
      <Stack.Screen
          name="Welcome"
          component={MyTabs}
          
        />
      <Stack.Screen name='Profile Creation' component={ProfileCreation} />
      <Stack.Screen name='Partner Roulette' component={PartnerRoulette} />
      <Stack.Screen name='Chat Screen' component={ChatScreen} />
      {/* <Stack.Screen name='Settings' component={MyTabs} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
