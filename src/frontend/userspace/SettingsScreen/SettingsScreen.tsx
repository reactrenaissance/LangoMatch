import { AntDesign } from "@expo/vector-icons";
import Feather from "@expo/vector-icons/Feather";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import { signOut } from "@firebase/auth";
import {
  HStack,
  Pressable,
  ScrollView,
  Text,
  VStack,
} from "@gluestack-ui/themed-native-base";
import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Alert } from "react-native";
import { auth } from "../../../backend/firebase/firebaseConfig";

type MenuItem = {
  title: string;
  icon: () => JSX.Element;
  onPress?: (navigation?: any) => void;
};

const menuItems: MenuItem[] = [
  {
    title: "Profile",
    icon: (props?: React.ComponentProps<typeof Feather>) => (
      <Feather name="user" size={24} color="black" {...props} />
    ),
    onPress: (navigation?: any) => navigation.navigate("ProfileScreen"),
  },
  {
    title: "Notifications",
    icon: (props?: React.ComponentProps<typeof Feather>) => (
      <Feather name="bell" size={24} color="black" {...props} />
    ),
    onPress: () => console.log("Settings"),
  },
  {
    title: "Appearance",
    icon: (props?: React.ComponentProps<typeof Feather>) => (
      <Feather name="eye" size={24} color="black" {...props} />
    ),
    onPress: () => console.log("Help"),
  },
  {
    title: "Privacy & Security",
    icon: (props?: React.ComponentProps<typeof Feather>) => (
      <Feather name="lock" size={24} color="black" {...props} />
    ),
    onPress: () => console.log("About"),
  },
  {
    title: "Help & Support",
    icon: (props?: React.ComponentProps<typeof Feather>) => (
      <Feather name="headphones" size={24} color="black" {...props} />
    ),
    onPress: () => console.log("About"),
  },
  {
    title: "About",
    icon: (props?: React.ComponentProps<typeof Feather>) => (
      <Feather name="help-circle" size={24} color="black" {...props} />
    ),
    onPress: (navigation?: any) => navigation.navigate("AboutScreen"),
  },
  {
    title: "Logout",
    icon: (props?: React.ComponentProps<typeof Feather>) => (
      <SimpleLineIcons name="logout" size={24} color="black" {...props} />
    ),
    onPress: () =>
      Alert.alert("Logout", "Are you sure you want to logout?", [
        {
          text: "No",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => signOut(auth),
        },
      ]),
  },
];

export default function SettingsScreen() {
  const navigation = useNavigation();
  return (
    <VStack background="#a19393" flexGrow={1} p={5}>
      <VStack
        space={4}
        px={4}
        py={4}
        bg={"white"}
        rounded="md"
        shadow={5}
        height="100%"
      >
        <HStack py={1} alignItems="center">
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
          <Text fontSize="lg" fontWeight="500" mx="auto">
            Settings
          </Text>
        </HStack>

        <ScrollView
          contentContainerStyle={{
            paddingVertical: 10,
            paddingHorizontal: 10,
          }}
          showsVerticalScrollIndicator={false}
        >

          <StatusBar backgroundColor="#f3f3f3" hidden />

          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <Pressable
                key={index}
                space={4}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                flexDirection="row"
                py={4}
                borderBottomWidth={1}
                borderBottomColor={
                  index === menuItems.length - 1 ? "white" : "#f3f3f3"
                }
                onPress={() => item.onPress?.(navigation)}
              >
                <HStack space={10} alignItems="center" gap="4">
                  <Icon size={20} />
                  <Text
                    fontSize="md"
                    fontWeight="500"
                    color="#0a0a0a"
                    textAlign="left"
                  >
                    {item.title}
                  </Text>
                </HStack>

                <Feather name="chevron-right" size={24} color="#0a0a0a" />
              </Pressable>
            );
          })}
        </ScrollView>
      </VStack>
    </VStack>
  );
}
