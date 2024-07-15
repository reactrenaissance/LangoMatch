import React from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { getProfileById } from "@backend/firebase/profile";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  HStack,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Spinner,
  Text,
  VStack,
} from "@gluestack-ui/themed-native-base";
import { Dimensions } from "react-native";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { checkAndAddNewChat } from "@backend/firebase/mesages";
import Toast from "react-native-toast-message";
import { StyleSheet, View } from "react-native";

export default function UserProfile() {
  const navigation = useNavigation();
  const queryClient = useQueryClient();

  const params = useRoute().params as {
    userId: string;
  };

  const userId = params?.userId;

  const getUserByIdQuery = useQuery(["getUserById", userId], {
    queryFn: () => getProfileById(userId),
    enabled: !!userId,
  });

  const addConversationMutation = useMutation(checkAndAddNewChat);

  const handleSwipeRight = async () => {
    try {
      await addConversationMutation.mutateAsync(userId);
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

  if (!userId) {
    return (
      <VStack flex={1} justifyContent="center" alignItems="center">
        <Text>userId not found</Text>
      </VStack>
    );
  }

  if (getUserByIdQuery.isLoading) {
    return (
      <VStack flex={1} justifyContent="center" alignItems="center">
        <Spinner accessibilityLabel="loading" size={"lg"} />
      </VStack>
    );
  }

  return (
    <ScrollView flexGrow={1}>
      <VStack w="full" height={Dimensions.get("window").height / 2.5}>
        <Image
          source={{
            uri: getUserByIdQuery.data.profileImageUri,
          }}
          alt="profile"
          w="full"
          h="full"
        />
      </VStack>
      <HStack justifyContent="center" alignItems="center" mt="-10" gap="4">
        <Pressable
          size="20"
          backgroundColor="#b4c0ee"
          borderRadius="full"
          display="flex"
          justifyContent="center"
          alignItems="center"
          onPress={handleSwipeRight}
        >
          <AntDesign name="heart" size={48} color="black" />
        </Pressable>
        <Pressable
          size="16"
          backgroundColor="#f0efef"
          borderRadius="full"
          display="flex"
          justifyContent="center"
          alignItems="center"
          onPress={() => navigation.navigate("PartnerRoulette")}
        >
          <FontAwesome name="remove" size={24} color="black" />
        </Pressable>

        {/* <Pressable
          size="16"
          backgroundColor="#f0efef"
          borderRadius="full"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <AntDesign name="star" size={35} color="black" />
        </Pressable> */}
      </HStack>

      <VStack px="4" py="4" gap="4">
        <Text fontWeight="bold" fontSize="lg">
          {getUserByIdQuery.data.displayName}
        </Text>

        <VStack>
          <Text fontWeight="bold" fontSize="lg">
            Bio
          </Text>
          <Text fontWeight="400" fontSize="16">
            {getUserByIdQuery.data.bio}
          </Text>
          <View style={{ paddingVertical: 20}}>
          <Text>
            Already speaks:
          </Text>
          <View style={styles.languageOptions}>
          <Text style={styles.textColor}  >
            {getUserByIdQuery.data.nativeIn?.join(', ')}
          </Text>
          </View>
          <Text style={{ marginTop: 5}}>
            Wants to learn:
          </Text >
          <View style={styles.languageOptions}>
          <Text style={styles.textColor}>
            {getUserByIdQuery.data.wishToLearn?.join(', ')}
          </Text>
          </View>
          </View>
        </VStack>
      </VStack>

      <Modal isOpen={addConversationMutation.isLoading}>
        <VStack flex={1} justifyContent="center" alignItems="center">
          <Spinner
            accessibilityLabel="loading"
            size={"lg"}
            color="primary.500"
          />
        </VStack>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  languageOptions: {
    backgroundColor: '#54A4D0',
    paddingVertical: 4,
    paddingHorizontal: 25,
    borderRadius: 6,
    width: 250,
    marginTop: 10,
  },
  textColor: {
    color: 'white',
  }
})