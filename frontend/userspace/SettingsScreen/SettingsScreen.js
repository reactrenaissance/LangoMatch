import { View, Text, Button } from "react-native";
import React from "react";
import { signOut } from "@firebase/auth";
import { auth } from "../../../backend/firebase/firebaseConfig";

export default function SettingsScreen() {
  return (
    <View style={{marginTop: 20}}>
      <Button onPress={() => signOut(auth)} title="Signout">
        Signout
      </Button>
    </View>
  );
}
