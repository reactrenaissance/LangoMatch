import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthScreen from './frontend/authentication/authScreen/authScreen'
import LogIn from './frontend/authentication/LogIn/LogIn';
import SignUp from './frontend/authentication/SignUp/SignUp';
import Onboarding from './frontend/authentication/SignUp/Onboarding';
import Welcome from './frontend/authentication/Welcome/Welcome';
import ProfileCreation from './frontend/authentication/SignUp/ProfileCreation';

const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Authentication Screen' screenOptions={{headerShown: false}} >
      <Stack.Screen name='Authentication Screen' component={AuthScreen}  />
      <Stack.Screen name='Log In Screen' component={LogIn} />
      <Stack.Screen name='Sign Up Screen' component={SignUp} />
      <Stack.Screen name='Onboarding' component={Onboarding} />
      <Stack.Screen name='Welcome' component={Welcome} />
      <Stack.Screen name='Profile Creation' component={ProfileCreation} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
