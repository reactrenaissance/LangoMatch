import { View, Text, Button, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { signOut } from "@firebase/auth";
import { auth } from "../../../backend/firebase/firebaseConfig";

export default function SettingsScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate('Profile Settings')}>
        <Text>Profile Settings</Text>
      </TouchableOpacity>
      <Button style={styles.signOutButton} onPress={() => signOut(auth)} title="Signout">
        Signout
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '95%',
    marginTop: 20,
    marginHorizontal: 10,
    // borderRadius: 20,
  },
  signOutButton: {
    borderRadius: 30,
  }
})