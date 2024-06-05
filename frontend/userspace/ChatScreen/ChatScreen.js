import React, { useState, useEffect, useCallback } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import { db } from '../../../backend/firebase/firebaseConfig';
import { collection, addDoc, query, orderBy, onSnapshot, where } from '@firebase/firestore';

const ChatScreen = ({ route }) => {
  const { chatId } = route.params;
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const messagesCollection = collection(db, 'Messages');
    const q = query(messagesCollection, where('senderId', '==', chatId), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messagesFirestore = querySnapshot.docs.map(doc => {
        const firebaseData = doc.data();
        const data = {
          _id: doc.id,
          text: '',
          createdAt: new Date().getTime(),
          ...firebaseData
        };

        if (!firebaseData.system) {
          data.user = {
            ...firebaseData.user,
            name: firebaseData.user.displayName
          };
        }

        return data;
      });

      setMessages(messagesFirestore);
    });

    return () => unsubscribe();
  }, []);
  

  const onSend = useCallback((messages = []) => {
    messages.forEach(async message => {
      const { _id, createdAt, text, user } = message;
      await addDoc(collection(db, 'Messages'), {
        _id,
        createdAt: createdAt.getTime(),
        text,
        user,
        senderId: chatId
      });
    });
  }, []);

  return (
    <GiftedChat
      messages={messages}
      onSend={messages => onSend(messages)}
      user={{
        _id: 1, // Static user id for example; use actual user id in production
      }}
    />
  );
};

export default ChatScreen;
