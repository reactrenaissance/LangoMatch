import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "@firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "./firebaseConfig";
import * as Crypto from "expo-crypto";
import { getProfileById } from "./profile";
import dayjs from "dayjs";

export interface Message {
  _id: string;
  text: string;
  createdAt: string;
  user: User;
  receiver: User;
  seen: boolean;
}

export interface User {
  _id: string;
  name: string;
  avatar: string;
}

export const checkAndAddNewChat = async (userId: string) => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      const qry = query(
        collection(db, "chats")
      );

      const resp = await getDocs(qry);

      const response = resp.docs.filter(doc => doc.data().users.includes(userId) && doc.data().users.includes(user.uid));
 
      if (!response.length) {
        const chat = {
          _id: Crypto.randomUUID(),
          users: [user.uid, userId],
          messages: [],
          createdAt: new Date().toISOString(),
        };
        await addDoc(collection(db, "chats"), chat);

        return chat;
      } else {
        return response[0].data();
      }
    }

    if (!user) {
      throw new Error("User not found");
    }
  } catch (error) {
    throw new Error(error);
  }
};

export const getConversations = async () => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User not found");
    }
    const userId = user.uid;

    const qry = query(
      collection(db, "chats"),
      where("users", "array-contains", userId)
    );

    const response = await getDocs(qry);

    const updatedResponse = response.docs.map(async (doc) => {
      const docData = doc.data();
      const otherUser = docData.users.find((id) => id !== userId);
      const otherUserDetails = await getProfileById(otherUser);

      const lastMessage = docData?.messages?.sort(
        (a, b) => dayjs(b.createdAt).unix() - dayjs(a.createdAt).unix()
      )[0];

      return {
        _id: doc.id,
        user: {
          _id: otherUser,
          ...otherUserDetails,
        },
        lastMessage: lastMessage,
        createdAt: lastMessage?.createdAt || docData?.createdAt,
      };
    });



    const messages = await Promise.all(updatedResponse);
    const sortedMessages = messages
    // .sort(
    //   (a, b) => dayjs(b.createdAt).unix() - dayjs(a.createdAt).unix()
    // );
    return sortedMessages;
  } catch (error) {
    throw new Error(error);
  }
};

export const getMessages = async (id: string) => {
  try {
    const docRef = doc(db, "chats", id);

    const response = await getDoc(docRef);

    const chat = response.data();

    if (!chat) {
      throw new Error("Chat not found");
    }

    const messages = chat.messages

    return messages as Message[];
  } catch (error) {
    throw new Error(error);
  }
};

export const sendMessage = async (userId: string, message: Message) => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      throw new Error("User not found");
    }

    const getUser = await getProfileById(user.uid);

    const getReceiver = await getProfileById(userId);

    const qry = query(
      collection(db, "chats")
    );

    const resp = await getDocs(qry);

    const response = resp.docs.filter(doc => doc.data().users.includes(userId) && doc.data().users.includes(user.uid));

    if (!response.length) {
      throw new Error("Chat not found");
    }

    const idOfChat = response[0].id;
    const oldData = response[0].data();

    const updatedMessages = [
      ...oldData.messages,
      {
        ...message,
        receiver: {
          _id: userId,
          name: getReceiver.displayName,
          avatar: getReceiver.profileImageUri,
        },
        user: {
          _id: user.uid,
          name: getUser.displayName,
          avatar: getUser.profileImageUri,
        },
      },
    ];

    await updateDoc(doc(db, "chats", idOfChat), {
      messages: updatedMessages,
    });

    return message;
  } catch (error) {
    throw new Error(error);
  }
};
