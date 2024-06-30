import { useNavigation } from "@react-navigation/native";
import { debounce } from "lodash";
import React, { useEffect } from "react";

import MessagingBody from "./components/MessagingBody";

import { Spinner, Text, VStack } from "@gluestack-ui/themed-native-base";
import { useQuery } from "react-query";
import { getConversations } from "@backend/firebase/mesages";
import { Profile } from "@backend/firebase/profile";
import { FlatList } from "react-native";
import { collection, onSnapshot } from "@firebase/firestore";
import { db } from "@backend/firebase/firebaseConfig";

type TChat = {
  _id: string;
  user: Profile & { _id: string };
  lastMessage: any;
};

export default function ConversationScreen() {
  const navigation = useNavigation();

  const getConversationsQuery = useQuery("getConversations", getConversations);

  const renderItem = ({ item }: { item: TChat }) => {
    return (
      <MessagingBody
        key={item._id}
        onPress={() =>
          navigation.navigate("Chats", {
            userId: item.user._id,
            id: item._id,
          })
        }
        username={item.user.displayName}
        avatarUrl={item.user.profileImageUri}
        lastMessage={item?.lastMessage?.text}
        lastMessageTime={item?.lastMessage?.createdAt}
      />
    );
  };

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "chats"), async (snapshot) => {
      getConversationsQuery.refetch();
    });

    return () => {
      unsub();
    };
  }, []);

  return (
    <FlatList
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      data={(getConversationsQuery?.data || []) as TChat[]}
      renderItem={renderItem}
      h={"full"}
      contentContainerStyle={{ flexGrow: 1, backgroundColor: "#fdfcfc" }}
      keyExtractor={(item) => item._id}
      ListEmptyComponent={
        <VStack flex={1} justifyContent="center" alignItems="center">
          {getConversationsQuery.isLoading ? (
            <Spinner
              accessibilityLabel="Loading spinner"
              color="primary.500"
              size="lg"
            />
          ) : (
            <Text>No conversations found</Text>
          )}
        </VStack>
      }
    />
  );
}
