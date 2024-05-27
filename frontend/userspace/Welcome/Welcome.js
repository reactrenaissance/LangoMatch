import React, { useEffect, useState } from "react";
import { collection, doc, onSnapshot } from "firebase/firestore";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  Image,
  ScrollView,
} from "react-native";
import { db } from "../../../backend/firebase/firebaseConfig";
// const data = [
//   {
//     id: "1",
//     name: "Hannah",
//     image:
//       "https://t4.ftcdn.net/jpg/03/83/25/83/360_F_383258331_D8imaEMl8Q3lf7EKU2Pi78Cn0R7KkW9o.jpg",
//     description: 'Description 1'
//   },
//   {
//     id: "2",
//     name: "Item 2",
//     image:
//       "https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg",
//   },
//   {
//     id: "3",
//     name: "Item 3",
//     image:
//       "https://t3.ftcdn.net/jpg/02/99/04/20/360_F_299042079_vGBD7wIlSeNl7vOevWHiL93G4koMM967.jpg",
//   },
//   {
//     id: "4",
//     name: "Item 4",
//     image:
//       "https://st.depositphotos.com/1144472/2003/i/950/depositphotos_20030237-stock-photo-cheerful-young-man-over-white.jpg",
//   },
// ];

export default function Welcome() {
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
          <Text style={styles.text}>{item.displayName}</Text>
          <Text style={styles.location}> {item.location} </Text>
          <Text style={styles.description}>{item.bio}</Text>
        </View>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  onboarding: {
    fontSize: 20,
    textAlign: "center",
    marginTop: 90,
    marginBottom: 15,
  },
  item: {
    flexDirection: "row",
    padding: 10,
    marginVertical: 8,
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
