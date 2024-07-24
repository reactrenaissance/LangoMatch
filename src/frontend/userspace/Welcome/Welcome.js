import React, { useEffect, useState } from "react";
import { collection, doc, onSnapshot } from "firebase/firestore";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { db } from "../../../backend/firebase/firebaseConfig";
import { SafeAreaView } from "react-native-safe-area-context";


export default function Welcome({ navigation, user }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "users"), (snapshot) => {
      let temp = [];
      snapshot.forEach((doc) => {
        temp.push({ ...doc.data(), id: doc.id });
      });
      setData(temp);
    });

    return unsub;
  }, []);

  const renderItem = ({ item }) => {
    return (
      <View style={styles.item}>
        <Image source={{ uri: item.profileImageUri }} style={styles.image} />
        <View>
          <TouchableOpacity onPress={() => navigation.navigate("UserProfile", {
            userId: item.id,
          })} >
            <Text style={styles.text}>{item.displayName}</Text>
            <Text style={styles.location}> {item.location} </Text>
            <Text style={styles.description}>{item.bio}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      {!!data?.length && <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
  },
  onboarding: {
    fontSize: 20,
    textAlign: "center",
    marginTop: 90,
    marginBottom: 15,
  },
  item: {
    flexDirection: "row",
    // padding: 10,
    marginVertical: 10,
    marginHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 20,
    marginRight: 10,
  },
  text: {
    fontSize: 14,
  },
  location: {
    fontSize: 7,
  },
  description: {
    fontSize: 10,
  },
});
