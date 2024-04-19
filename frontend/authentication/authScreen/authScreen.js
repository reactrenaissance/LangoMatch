import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import CustomButton from "../components/CustomButton";

export default function AuthScreen({ navigation }) {

    const handleLogin = () => {
        // Handle login
        console.log('Log in button pressed');
        navigation.navigate('Log In Screen')
      };
    
      const handleSignUp = () => {
        // Handle sign up
        console.log('Sign Up button pressed');
        navigation.navigate('Sign Up Screen')
      }

    return (
        <View style={styles.container}>
            <Text style={styles.appName}>LangoMatch</Text>
            <Text style={styles.subText}>Find language partners</Text>
            <Text style={styles.subText}>and become fluent </Text>
            <View style={styles.buttonContainer}>
            <CustomButton title="Log In" onPress={handleLogin} />
            <CustomButton title="Sign Up" onPress={handleSignUp} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    appName: {
        fontSize: 30,
        fontWeight: 'bold',
    },
    subText: {
        fontSize: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '60%',
    }
})