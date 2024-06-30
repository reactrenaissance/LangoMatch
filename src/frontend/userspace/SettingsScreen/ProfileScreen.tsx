import { getProfile, updateProfileApi } from "@backend/firebase/profile";
import uploadImage from "@backend/firebase/uploadImage";
import { AntDesign, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import {
  Box,
  Button,
  Center,
  FormControl,
  HStack,
  Input,
  Pressable,
  ScrollView,
  Text,
  VStack,
  useToast,
} from "@gluestack-ui/themed-native-base";
import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import {
  PhoneAuthProvider,
  getAuth,
  updatePassword,
  updatePhoneNumber,
  updateProfile,
} from "firebase/auth";
import { useFormik } from "formik";
import React, { useEffect } from "react";

import { Alert, Image as RNImage, TextInput } from "react-native";
import Toast from "react-native-toast-message";
import { useMutation, useQuery, useQueryClient } from "react-query";
import SelectLocation from "src/components/SelectLocation";
import useImagePicker from "src/hook/use-image-picker";
import * as Yup from "yup";

const defaultAvatar = require("@assets/images/avatar.jpg");
const defaultAvatarUri = RNImage.resolveAssetSource(defaultAvatar).uri;

const AVATAR_SIZE_IN_PX = `100`;

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  bio: Yup.string().required("Bio is required"),
});

export default function ProfileScreen() {
  const { pickImage, file } = useImagePicker({});
  const uploadImageMutation = useMutation(uploadImage);

  const [showPassword, setShowPassword] = React.useState(false);

  const queryClient = useQueryClient();

  const updateProfileMutation = useMutation(updateProfileApi);
  const { data } = useQuery("user", getProfile);

  const formik = useFormik({
    initialValues: {
      name: "",
      password: "",
      phone: "",
      location: "",
      bio: "",
    },
    onSubmit: async (values, { setFieldError }) => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
          let image = null as { url: string } | null;
          if (file) {
            image = await uploadImageMutation.mutateAsync({
              uri: file?.assets?.[0]?.uri,
            });
          }

          if (values.password) {
            if (
              !values.password.match(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
              )
            ) {
              setFieldError(
                "password",
                "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number and one special character."
              );
              return;
            }

            await updatePassword(user, values.password);
          }

          await updateProfileMutation.mutateAsync({
            bio: data.bio,
            displayName: values.name,
            isAvailable: data.isAvailable,
            location: data.location,
            phone: values.phone,
            profileImageUri: image?.url || data.profileImageUri,
          });

          queryClient.invalidateQueries("user");
          Toast.show({
            type: "success",
            text1: "Profile Updated!",
            text2: "Your profile has been updated successfully!",
          });
        }
      } catch (error) {
        console.log(error);
      }
    },
    validationSchema,
  });

  const [showLOcationPicker, setShowLocationPicker] = React.useState(false);

  useEffect(() => {
    if (data) {
      formik.setFieldValue("name", data.displayName);
      formik.setFieldValue("phone", data.phone);
      formik.setFieldValue("location", data.location);
      formik.setFieldValue("bio", data.bio);
    }
  }, [data]);

  const navigation = useNavigation();
  return (
    <VStack background="#a19393" flexGrow={1} p={5}>
      <StatusBar backgroundColor="#f3f3f3" hidden />
      <VStack
        space={4}
        py={4}
        height="100%"
        bg={"white"}
        rounded="md"
        shadow={5}
      >
        <HStack py={1} alignItems="center" px={4}>
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
            Update Profile
          </Text>
        </HStack>

        <VStack flex={1}>
          <ScrollView
            contentContainerStyle={{
              paddingVertical: 10,
            }}
            px={5}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled
          >
            <Center pb={8} pt={4}>
              <Box
                height={AVATAR_SIZE_IN_PX}
                width={AVATAR_SIZE_IN_PX}
                position="relative"
              >
                <Box
                  rounded="full"
                  bg="white"
                  height={AVATAR_SIZE_IN_PX}
                  width={AVATAR_SIZE_IN_PX}
                  overflow="hidden"
                >
                  <RNImage
                    source={{
                      uri:
                        data?.profileImageUri ||
                        file?.assets?.[0]?.uri ||
                        defaultAvatarUri,
                    }}
                    alt="avatar"
                    style={{
                      width: "100%",
                      height: "100%",
                      resizeMode: "cover",
                    }}
                    key={file?.assets?.[0]?.uri || defaultAvatarUri}
                  />
                </Box>

                <Pressable
                  position="absolute"
                  top={-2}
                  right={-2}
                  bg="#bfc9d2"
                  rounded="full"
                  p={2}
                  borderWidth={4}
                  borderColor="white"
                  onPress={pickImage}
                >
                  <MaterialCommunityIcons
                    name="folder-image"
                    size={16}
                    color="#fff"
                  />
                </Pressable>
              </Box>
            </Center>

            <VStack gap={5}>
              <FormControl
                gap={1}
                isInvalid={formik.touched.name && formik.errors.name}
              >
                <Text
                  fontWeight="500"
                  textTransform="uppercase"
                  color="#a59e9e"
                  fontSize="sm"
                >
                  Your Name
                </Text>
                <Input
                  placeholder="Enter Your Name"
                  variant="underlined"
                  height={"150px"}
                  onChangeText={formik.handleChange("name")}
                  onBlur={formik.handleBlur("name")}
                  value={formik.values.name}
                />
                <FormControl.ErrorMessage>
                  {formik.errors.name}
                </FormControl.ErrorMessage>
              </FormControl>
              <FormControl
                gap={1}
                isInvalid={formik.touched.password && formik.errors.password}
              >
                <Text
                  fontWeight="500"
                  textTransform="uppercase"
                  color="#a59e9e"
                  fontSize="sm"
                >
                  Your Password
                </Text>
                <Input
                  placeholder="Enter Your Password"
                  variant="underlined"
                  height={"150px"}
                  type={showPassword ? "text" : "password"}
                  onChangeText={formik.handleChange("password")}
                  onBlur={formik.handleBlur("password")}
                  value={formik.values.password}
                  rightElement={
                    <Pressable onPress={() => setShowPassword(!showPassword)}>
                      <Feather
                        name={showPassword ? "eye" : "eye-off"}
                        size={20}
                      />
                    </Pressable>
                  }
                  passwordRules="minlength: 8; required: lower; required: upper; required: digit; required: special;"
                />
                <FormControl.ErrorMessage>
                  {formik.errors.password}
                </FormControl.ErrorMessage>
              </FormControl>
              <FormControl gap={1}>
                <Text
                  fontWeight="500"
                  textTransform="uppercase"
                  color="#a59e9e"
                  fontSize="sm"
                >
                  Your Phone
                </Text>
                <Input
                  placeholder="Enter Your Phone"
                  variant="underlined"
                  height={"150px"}
                  onChangeText={formik.handleChange("phone")}
                  onBlur={formik.handleBlur("phone")}
                  value={formik.values.phone}
                  keyboardType="phone-pad"
                />
                <FormControl.ErrorMessage>
                  {formik.errors.phone}
                </FormControl.ErrorMessage>
              </FormControl>

              <FormControl
                gap={1}
                isInvalid={formik.touched.bio && formik.errors.bio}
              >
                <Text
                  fontWeight="500"
                  textTransform="uppercase"
                  color="#a59e9e"
                  fontSize="sm"
                >
                  Bio
                </Text>
                <Input
                  placeholder="Enter Your Bio"
                  variant="underlined"
                  onChangeText={formik.handleChange("bio")}
                  onBlur={formik.handleBlur("bio")}
                  value={formik.values.bio}
                  multiline
                  
                  textAlignVertical="top"
                />
                <FormControl.ErrorMessage>
                  {formik.errors.bio}
                </FormControl.ErrorMessage>
              </FormControl>

              <FormControl gap={1} isInvalid={formik.errors.location}>
                <Text
                  fontWeight="500"
                  textTransform="uppercase"
                  color="#a59e9e"
                  fontSize="sm"
                >
                  Location
                </Text>
                <Pressable
                  px={1}
                  py={2}
                  borderBottomWidth={1}
                  borderBottomColor="#d8d8d8"
                  onPress={() => setShowLocationPicker(true)}
                >
                  <Text>
                    {formik.values.location || "Select your location"}
                  </Text>
                </Pressable>
                <FormControl.ErrorMessage>
                  {formik.errors.location}
                </FormControl.ErrorMessage>
              </FormControl>

              <Button
                _text={{
                  color: "white",
                }}
                bg="#3b5998"
                rounded="xl"
                height={50}
                mt={5}
                isLoading={
                  uploadImageMutation.isLoading ||
                  updateProfileMutation.isLoading ||
                  formik.isSubmitting
                }
                onPress={formik.handleSubmit as any}
              >
                Save
              </Button>
            </VStack>
          </ScrollView>
        </VStack>
      </VStack>
      <SelectLocation
        isOpen={showLOcationPicker}
        onClose={() => setShowLocationPicker(false)}
        onSelectLocation={(location) => {
          formik.setFieldValue("location", location);
        }}
      />
    </VStack>
  );
}
