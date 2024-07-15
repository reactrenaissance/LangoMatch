import { db } from "@backend/firebase/firebaseConfig";
import { Message, getMessages, sendMessage } from "@backend/firebase/mesages";
import { getProfile, getProfileById } from "@backend/firebase/profile";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { doc, onSnapshot } from "@firebase/firestore";
import {
  Box,
  HStack,
  Pressable,
  Skeleton,
  Spinner,
  Text,
  VStack,
} from "@gluestack-ui/themed-native-base";
import { useNavigation, useRoute } from "@react-navigation/native";
import dayjs from "dayjs";
import React, { useCallback, useEffect } from "react";
import { Image, Keyboard } from "react-native";
import {
  Day,
  GiftedChat,
  IMessage,
  InputToolbar,
  InputToolbarProps,
} from "react-native-gifted-chat";
import { useMutation, useQuery, useQueryClient } from "react-query";

export default function MessageView() {
  const queryClient = useQueryClient();
  const [text, setText] = React.useState("");

  const route = useRoute() as {
    params: {
      userId: string;
      id: string;
    };
  };

  const userId = route.params.userId;
  const id = route.params.id;

  const getUserByIdQuery = useQuery(["getUserById", userId], {
    queryFn: () => getProfileById(userId),
    enabled: !!userId,
  });

  const sendMessageMutation = useMutation({
    mutationFn: (msg: Message) => sendMessage(userId, msg),
  });

  const myProfileQuery = useQuery("getProfile", getProfile, {
    refetchOnWindowFocus: true,
  });

  const chatsQuery = useQuery("getChats", {
    queryFn: () => getMessages(id),
    enabled: !!id,
  });

  const messages = chatsQuery.data || []
  const currentUser = React.useMemo(() => {
    return {
      _id: myProfileQuery.data?._id,
      name: myProfileQuery.data?.displayName,
      avatar: myProfileQuery.data?.profileImageUri,
    };
  }, [myProfileQuery]);

  const receiver = React.useMemo(() => {
    return {
      _id: getUserByIdQuery.data?._id,
      name: getUserByIdQuery.data?.displayName,
      avatar: getUserByIdQuery.data?.profileImageUri,
    };
  }, [getUserByIdQuery]);

  const navigation = useNavigation();

  React.useLayoutEffect(() => {
    async function fetchUser() {
      navigation.setOptions({
        headerShown: true,
        header: () => (
          <HStack alignItems={"center"} bg="white" px={4} py={2} gap={2}>
            <Pressable
              px={2}
              py={2}
              onPress={() => {
                if (navigation.canGoBack()) {
                  navigation.goBack();
                }
              }}
            >
              <AntDesign name="arrowleft" size={24} color="black" />
            </Pressable>
            <Image
              source={{
                uri: getUserByIdQuery.data?.profileImageUri,
              }}
              style={{ width: 40, height: 40, borderRadius: 50 }}
            />
            <VStack justifyContent={"center"}>
              <Text
                fontSize={14}
                // fontFamily={"body"}
                fontWeight={700}
                color={"#3D454A"}
              >
                {getUserByIdQuery.data?.displayName}
              </Text>
              <Text
                fontSize={12}
                // fontFamily={"body"}
                fontWeight={500}
                color={"#3D454A"}
              >
                Online
              </Text>
            </VStack>
          </HStack>
        ),
      });
    }

    if (getUserByIdQuery.isSuccess) fetchUser();
  }, [getUserByIdQuery]);

  const renderInputToolbar = (props: InputToolbarProps<IMessage>) => {
    return (
      <InputToolbar
        {...props}
        containerStyle={{
          backgroundColor: "white",
          borderTopColor: "#E8E8E8",
          borderTopWidth: 1,
          paddingHorizontal: 8,
          paddingVertical: 16,
          alignItems: "center",
        }}
      />
    );
  };

  const renderMessage = (props) => {
    const { currentMessage } = props;
    const self = currentMessage.user._id === currentUser._id;
    let date = currentMessage.createdAt;

    date = dayjs(date).format("h:mm A").toString();
    return (
      <HStack
        py={1}
        px={4}
        w={"full"}
        justifyContent={self ? "flex-end" : "flex-start"}
      >
        <VStack maxWidth={"60%"} minWidth={"40%"}>
          <Box
            borderRadius={10}
            px={4}
            py="2"
            bg={self ? "#52B69A" : "#E6E8EB"}
            minW={40}
          >
            <Text
              // fontFamily={"body"}
              fontWeight={400}
              key={currentMessage._id}
              color={self ? "#fff" : "#687076"}
              textAlign="center"
            >
              {currentMessage.text}
            </Text>
          </Box>
          <Text
            // fontFamily={"body"}
            fontWeight={400}
            fontSize={10}
            color={"#889096"}
            textAlign={self ? "right" : "left"}
          >
            Send at {date}
          </Text>
        </VStack>
      </HStack>
    );
  };

  const onSend = useCallback((msz = []) => {
    const message = msz[0].text as string;
    if (!message || message?.trim?.().length === 0) return;

    Keyboard.dismiss();
    const appendMessages = async () => {
      try {
        const res = GiftedChat.append(messages, msz);

        const message: Message = {
          _id: res[0]._id,
          text: res[0].text,
          createdAt: new Date().toISOString(),
          user: currentUser,
          receiver: receiver,
          seen: false,
        };


        await sendMessageMutation.mutateAsync(message);

        queryClient.invalidateQueries("getChats");
        queryClient.invalidateQueries("getConversations");
        setText("");
      } catch (error) {
        console.error(error);
      }
    };

    appendMessages();
  }, []);

  const renderDay = (props) => {
    return <Day {...props} textStyle={{ color: "#000" }} />;
  };

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", id), (doc) => {
      queryClient.invalidateQueries("getChats");
      queryClient.invalidateQueries("getConversations");
    });

    return () => unSub();
  }, [id]);

  if (
    getUserByIdQuery.isLoading ||
    myProfileQuery.isLoading ||
    chatsQuery.isLoading ||
    getUserByIdQuery.isFetching ||
    myProfileQuery.isFetching
  )
    return (
      <VStack flex={1} justifyContent="center" alignItems="center" gap="4">
        <Spinner size="lg" color="primary.500" />
      </VStack>
    );

  const sortedMessages = messages?.sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return (
    <>
      <GiftedChat
        messages={(sortedMessages || []) as unknown as IMessage[]}
        onSend={onSend}
        renderInputToolbar={renderInputToolbar}
        textInputStyle={{
          backgroundColor: "#F1F3F5",
          paddingVertical: 14,
          paddingHorizontal: 16,
          borderRadius: 10,
        }}
        renderSend={(props) => (
          <Box h={"full"} alignSelf={"center"} px={4} justifyContent="center">
            <Pressable
              py={3}
              px={3}
              borderRadius={10}
              onPress={() => props.onSend({ text: props.text })}
              bg="#52B69A"
              isDisabled={
                props.text.trim().length === 0 ||
                !props.text ||
                sendMessageMutation.isLoading
              }
              opacity={
                props.text.trim().length === 0 ||
                !props.text ||
                sendMessageMutation.isLoading
                  ? 0.7
                  : 1
              }
            >
              {sendMessageMutation.isLoading ? (
                <Spinner size="sm" color="white" />
              ) : (
                <Ionicons name="send" color={"#fff"} size={20} />
              )}
            </Pressable>
          </Box>
        )}
        renderMessage={renderMessage}
        minInputToolbarHeight={80}
        infiniteScroll
        keyboardShouldPersistTaps="never"
        user={{
          _id: currentUser._id,
          name: currentUser.name,
          avatar: currentUser.avatar,
        }}
        text={text}
        onInputTextChanged={setText}
        textInputProps={{
          readOnly: sendMessageMutation.isLoading,
        }}
        
        listViewProps={{
          showsVerticalScrollIndicator: false,
          showsHorizontalScrollIndicator: false,
          flexGrow: 1,
          backgroundColor: "#fdfcfc",
        }}
        renderDay={renderDay}
        initialText={"Say Hello! 🎉"}
      />
    </>
  );
}
