import { Text, View, StyleSheet, Button, Image } from "react-native";
import Card from "../../authentication/components/RouletteCards";
import Swiper from "react-native-deck-swiper";
import React, { useEffect, useState } from "react";
import { db } from "../../../backend/firebase/firebaseConfig";
import { collection, where, query, getDocs, and } from "@firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { checkAndAddNewChat } from "@backend/firebase/mesages";
import LoaderModal from "src/components/LoaderModal";
import Toast from "react-native-toast-message";
import { getAuth } from "firebase/auth";
import { fetchUsers } from "@backend/firebase/users";
import { Spinner, VStack } from "@gluestack-ui/themed-native-base";

const PartnerRoulette = () => {
  const navigation = useNavigation();
  const queryClient = useQueryClient();

  const usersQuery = useQuery("getUsers", fetchUsers);

  const addConversationMutation = useMutation(checkAndAddNewChat);

  const handleSwipeRight = async (cardIndex) => {
    try {
      await addConversationMutation.mutateAsync(users[cardIndex]._id);
      queryClient.invalidateQueries("getConversations");
      queryClient.invalidateQueries("getChats");
      navigation.navigate("ConversationScreen");
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Something went wrong. Please try again",
      });
    }
  };

  const users = usersQuery?.data || [];

  if (usersQuery.isLoading || usersQuery.isFetching) {
    return (
      <VStack flex={1} justifyContent="center" alignItems="center">
        <Spinner
          accessibilityLabel="Loading spinner"
          color="primary.500"
          size="lg"
        />
      </VStack>
    );
  }

  if (usersQuery.isError) {
    return (
      <VStack flex={1} justifyContent="center" alignItems="center">
        <Text>Something went wrong. Please try again</Text>
      </VStack>
    );
  }

  if (users.length === 0) {
    return (
      <VStack flex={1} justifyContent="center" alignItems="center">
        <Text>No users found</Text>
      </VStack>
    );
  }

  return (
    <View style={styles.container}>
      {users.length > 0 && (
        <Swiper
          cards={users}
          keyExtractor={(user) => user._id}
          // infinite={false}
          renderCard={(user, cardIndex) => {
            console.log(cardIndex);
            return <Card key={user._id} user={user} />;
          }}
          // showSecondCard={false}

          onSwiped={(cardIndex) => {}}
          onSwipedRight={(cardIndex) => {
            handleSwipeRight(cardIndex);
          }}
          onSwipedAll={() => {
            queryClient.invalidateQueries("getUsers");
          }}
          cardIndex={0}
          onTapCard={(cardIndex) => {
            const user = users[cardIndex];
            console.log(user)
            navigation.navigate("UserProfile", { 
              userId: user._id,
             });
          }}
          // backgroundColor={'red'}
          stackSize={3}
          stackDepth={2}
        ></Swiper>
      )}

      <LoaderModal isVisible={addConversationMutation.isLoading} />
    </View>
  );
};

export default PartnerRoulette;

const styles = StyleSheet.create({
  paigeContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#F5FCFF",
  },
  card: {
    flex: 1,
    // borderRadius: 4,
    // borderWidth: 2,
    // borderColor: "#E8E8E8",
    // justifyContent: "center",
    // backgroundColor: "white"
  },
  text: {
    textAlign: "center",
    fontSize: 50,
    backgroundColor: "transparent",
  },
});
