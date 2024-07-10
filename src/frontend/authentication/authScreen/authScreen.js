import applogo from "@assets/applogo.png";
import { auth } from "@backend/firebase/firebaseConfig";
import { onAuthStateChanged } from "@firebase/auth";
import { useEffect } from "react";
import { Image, StyleSheet, Text, View, Dimensions } from "react-native";
import CustomButton from "../components/CustomButton";
// import { Image } from 'expo-image';

  const { width, height } = Dimensions.get('window');

export default function AuthScreen({ navigation }) {
  


  const handleLogin = () => {
    // Handle login
    console.log("Log in button pressed");
    navigation.navigate("LogInScreen");
  };

  const handleSignUp = () => {
    // Handle sign up
    console.log("Sign Up button pressed");
    navigation.navigate("SignUpScreen");
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        navigation.navigate("Welcome");
      }
      else {
        navigation.navigate("AuthenticationScreen");
      }
    });
  }, []);

  return (
    <View style={styles.container}>
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <Image
          source={applogo}
          style={styles.logo}
        />
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "white",
  },
  appName: {
    fontSize: 30,
    fontWeight: "bold",
    marginVertical: 7,
    marginTop: 15,
  },
  subText: {
    fontSize: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "60%",
    marginVertical: 17,
  },
  logo: {
    width: width, // 100% of screen width
    height: height * 0.6, // 60% of screen height
  },
});
