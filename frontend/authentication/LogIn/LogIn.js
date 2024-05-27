import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import InputField from "../components/InputField";
import CustomButton from "../components/CustomButton";
import { useState } from "react";
import { auth } from "../../../backend/firebase/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import Welcome from "../../userspace/Welcome/Welcome";

export default function LogIn({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    console.log({ email, password });

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredentials) => {
        const user = userCredentials.user;
        console.log("Logged in with:", user.email);
        navigation.navigate("Welcome");
      })
      .catch((error) => {
        console.error("Login failed", error.message);
        alert(error.message)
      });
  };

  const promiseFunction = () => {
    return new Promise((resole, reject) => {
      reject(false);
    });
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.logInText}>LOG IN</Text>
        <Text style={styles.credentialsText}>Email</Text>
        <View style={styles.inputContainer}>
          <InputField
            placeholder="Enter your email address"
            value={email}
            onChangeText={setEmail}
          />
        </View>
        <Text style={styles.credentialsText}>Password</Text>
        <View style={styles.inputContainer}>
          <InputField
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
          />
        </View>
        <TouchableOpacity>
          <Text style={{ textAlign: "right", marginRight: 60, fontSize: 10 }}>
            Forgot your password?
          </Text>
        </TouchableOpacity>
        <View style={{ alignItems: "center" }}>
          <CustomButton
            style={styles.Button}
            title="Sign in"
            onPress={handleLogin}
          />
          <TouchableOpacity>
            <Text style={styles.newUser}>New user? Register now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fffff",
    flex: 1,
    alignItems: "center",
  },
  logInText: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 150,
  },
  inputContainer: {
    width: 450,
    alignItems: "center",
  },
  credentialsText: {
    textAlign: "left",
    marginLeft: 60,
    marginTop: 15,
  },
  Button: {
    width: "75%",
    height: 35,
    borderRadius: 10,
    marginTop: 10,
    justifyContent: "center",
  },
  newUser: {
    fontWeight: "bold",
    marginTop: 5,
    fontSize: 13,
  },
});
