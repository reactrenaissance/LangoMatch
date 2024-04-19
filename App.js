import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthScreen from './frontend/authentication/authScreen/authScreen'
import LogIn from './frontend/authentication/LogIn/LogIn';
import SignUp from './frontend/authentication/SignUp/SignUp';

const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Authentication Screen' screenOptions={{headerShown: false}} >
      <Stack.Screen name='Authentication Screen' component={AuthScreen}  />
      <Stack.Screen name='Log In Screen' component={LogIn} />
      <Stack.Screen name='Sign Up Screen' component={SignUp} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
