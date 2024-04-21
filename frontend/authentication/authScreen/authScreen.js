import { Text, View, StyleSheet, Image } from "react-native";
import CustomButton from "../components/CustomButton";
import applogo from '../../../assets/images/applogo.webp'

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
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Image source={applogo} style={{ width: 350, height: 350, 
                marginTop: 35, marginBottom: 20, marginLeft: 20 }} />
            </View>
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
        backgroundColor: 'white',
    },
    appName: {
        fontSize: 30,
        fontWeight: 'bold',
        marginVertical: 7,
        marginTop: 15,
    },
    subText: {
        fontSize: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '60%',
        marginVertical: 17,
    }
})