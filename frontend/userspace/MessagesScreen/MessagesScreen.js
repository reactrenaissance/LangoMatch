import { StyleSheet, Text, View, FlatList, Image } from "react-native";
import React, { useState, useEffect } from "react";
import { db } from "../../../backend/firebase/firebaseConfig";
import {
  collection,
  query,
  orderBy,
  doc,
  onSnapshot,
  getDocs,
} from "@firebase/firestore";

const MessagesScreen = ({ navigation, user }) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const messagesRef = collection(db, "Messages");
    const q = query(messagesRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messagesArray = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
        senderProfileImage: doc.data().profileImageUri,
      }));
      setMessages([...messagesArray]);
    });
    return () => unsubscribe();
  }, []);

  return (
    <View>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.messageBox}>
            <Text style={styles.senderText}>{`From: ${item.senderId}`}</Text>
            <Image style={styles.profilePic} source={{ uri: item.senderProfileImage }} />
            <Text style={styles.messageText}>{item.text}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  messageBox: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: "lightgrey",
    borderRadius: 5,
    width: 300,
    height: 300,
  },
  messageText: {
    fontSize: 16,
  },
  senderText: {
    fontSize: 12,
    marginTop: 4,
    fontStyle: "italic",
  },
  profilePic: {
    width: 100,
    height: 100,
  }
});

export default MessagesScreen;
