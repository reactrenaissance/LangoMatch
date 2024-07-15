import {
  Box,
  HStack,
  Image,
  Pressable,
  Text,
  VStack
} from "@gluestack-ui/themed-native-base";
import dayjs from "dayjs";
import React from "react";

dayjs.extend(require("dayjs/plugin/relativeTime")); 

export default function MessagingBody({
  username,
  lastMessage,
  onPress,
  avatarUrl,
  lastMessageTime,
}: {
  username: string;
  lastMessage?: string;
  onPress: () => void;
  avatarUrl: string;
  lastMessageTime?: string;
}) {
  return (
    <Pressable onPress={onPress}>
      <HStack
        py={2}
        px={4}
        borderBottomColor={"#E6E8EB"}
        borderBottomWidth={2}
        justifyContent={"space-between"}
        alignItems="center"
      >
        <HStack gap={3} alignItems="center">
          <Image
            size={10}
            source={{
              uri: avatarUrl,
            }}
            alt={"avatar"}
            rounded={"full"}
          />
          <VStack>
            <Text
              fontSize={14}
              // fontFamily={"body"}
              numberOfLines={1}
              maxW={50}
              fontWeight={700}
              color={"#3D454A"}
              textTransform="capitalize"
            >
              {username}
            </Text>
            <Text
              fontSize={14}
              // fontFamily={"body"}
              numberOfLines={1}
              maxW={"80%"}
              fontWeight={500}
              color={"#11181C"}
            >
              {lastMessage
                ? lastMessage
                : `${username} wants to practice. Exchange now`}
            </Text>
          </VStack>
        </HStack>

        <Box>
          <Text fontSize={12} 
          // fontFamily={"body"} 
          color={"#3D454A"}>
            {dayjs(lastMessageTime).fromNow()}
          </Text>
        </Box>
      </HStack>
    </Pressable>
  );
}
