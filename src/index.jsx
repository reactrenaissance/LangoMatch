import LogIn from "@frontend/authentication/LogIn/LogIn";
import Onboarding from "@frontend/authentication/SignUp/Onboarding";
import ProfileCreation from "@frontend/authentication/SignUp/ProfileCreation";
import SignUp from "@frontend/authentication/SignUp/SignUp";
import AuthScreen from "@frontend/authentication/authScreen/authScreen";
import ChatScreen from "@frontend/userspace/ChatScreen/ChatScreen";
import PartnerRoulette from "@frontend/userspace/PartnerRoulette/PartnerRoulette";
import SettingsScreen from "@frontend/userspace/SettingsScreen/SettingsScreen";
import Welcome from "@frontend/userspace/Welcome/Welcome";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import ProfileScreen from "@frontend/userspace/SettingsScreen/ProfileScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ConversationScreen from "@frontend/userspace/Conversation/Messaging";
import UserProfile from "@frontend/userspace/UserProfile";
import AboutScreen from "@frontend/userspace/AboutScreen/AboutScreen";
import SupportScreen from "@frontend/userspace/SupportScreen/SupportScreen";
import { Linking } from "react-native";
import * as Notifications from 'expo-notifications';


const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tab.Screen
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" size={size} color={color} />
          ),
        }}
        name="Home"
        component={Welcome}
      />
      <Tab.Screen
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="cards" size={size} color={color} />
          ),
        }}
        name="Explore"
        component={PartnerRoulette}
      />

      <Tab.Screen
        name="ConversationScreen"
        component={ConversationScreen}
        options={{
          headerShown: true,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="chat" size={size} color={color} />
          ),
          title: "Chat",
          headerTitleAlign: "center",
        }}
      />
      <Tab.Screen
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="tools" size={size} color={color} />
          ),
        }}
        name="Settings"
        component={SettingsScreen}
      />
    </Tab.Navigator>
  );
}

const Stack = createNativeStackNavigator();
export default function Home() {
  return (
    <NavigationContainer linking={{
      config: {
        // Configuration for linking
      },
      async getInitialURL() {
        // First, you may want to do the default deep link handling
        // Check if app was opened from a deep link
        const url = await Linking.getInitialURL();

        if (url != null) {
          return url;
        }

        // Handle URL from expo push notifications
        const response = await Notifications.getLastNotificationResponseAsync();

        return response?.notification.request.content.data.url;
      },
      subscribe(listener) {
        const onReceiveURL = ({ url }) => listener(url);

        // Listen to incoming links from deep linking
        const eventListenerSubscription = Linking.addEventListener('url', onReceiveURL);

        // Listen to expo push notifications
        const subscription = Notifications.addNotificationResponseReceivedListener(response => {
          const url = response.notification.request.content.data.url;

          // Any custom logic to see whether the URL needs to be handled
          //...

          // Let React Navigation handle the URL
          listener(url);
        });

        return () => {
          // Clean up the event listeners
          eventListenerSubscription.remove();
          subscription.remove();
        };
      },
    }}>
      <Stack.Navigator
        initialRouteName="AuthenticationScreen"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="AuthenticationScreen" component={AuthScreen} />
        <Stack.Screen name="LogInScreen" component={LogIn} />
        <Stack.Screen name="SignUpScreen" component={SignUp} />
        <Stack.Screen name="Onboarding" component={Onboarding} />
        <Stack.Screen name="Welcome" component={MyTabs} />
        <Stack.Screen name="ProfileCreation" component={ProfileCreation} />
        <Stack.Screen name="PartnerRoulette" component={PartnerRoulette} />

        <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
        <Stack.Screen name="Chats" component={ChatScreen} />
        <Stack.Screen name="UserProfile" component={UserProfile} />
        <Stack.Screen name="AboutScreen" component={AboutScreen} />
        <Stack.Screen name="SupportScreen" component={SupportScreen} />
        {/* <Stack.Screen name='Settings' component={MyTabs} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
