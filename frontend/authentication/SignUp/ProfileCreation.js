import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  Image,
  Platform,
  ActivityIndicator,
} from "react-native";
import InputField from "../components/InputField";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { useEffect, useState } from "react";
import CustomButton from "../components/CustomButton";
import { db, auth, storage } from "../../../backend/firebase/firebaseConfig";
import { doc, setDoc, addDoc } from "firebase/firestore";
import * as ImagePicker from "expo-image-picker";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileCreation({ navigation }) {
  const [profileImageUri, setProfileImageUri] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [bio, setBio] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [location, setLocation] = useState(null);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
  }, []);

  const selectImage = async () => {
    setIsLoading(true);
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setProfileImageUri(uri);
      const url = await uploadImage(uri);
      console.log({ url });
    } else {
      setIsLoading(false);
    }
  };

  const uploadImage = async (uri) => {
    if (!profileImageUri) return;
    setIsLoading(true);
    console.log("Auth UID:", auth.currentUser.uid);
    console.log(
      "Storage Path:",
      `profile_images/${auth.currentUser.uid}/profile_pic`
    );

    const response = await fetch(uri);
    const blob = await response.blob();
    const storageRef = ref(
      storage,
      `profile_images/${auth.currentUser.uid}/profile_pic`
    );

    console.log("Current User UID:", auth.currentUser?.uid);

    try {
      const snapshot = await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(snapshot.ref);
      setProfileImageUri(downloadURL);
      console.log("Image uploaded and URL fetched:", downloadURL);
      setIsLoading(false);
      return downloadURL;
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image.");
    } finally {
      setIsLoading(false);
    }
  };

  const saveUserProfile = async () => {
    try {
      const userProfileDoc = doc(db, "users", auth.currentUser.uid);
      await setDoc(userProfileDoc, {
        displayName,
        profileImageUri,
        bio,
        location,
      });
      console.log("Profile data saved successfully!");
    } catch (error) {
      console.error("Error saving profile data:", error);
      alert("Error saving profile data.");
    } finally {
      setIsLoading(false);
    }
  };

  const goToWelcomeScreen = async () => {
    if (!displayName || !profileImageUri || !location || bio.length < 20) {
      alert("Please make sure all fields are filled correctly and try again.");
      return;
    }
    // const downloadURL = await uploadImage(profileImageUri);
    // console.log({downloadURL});
    if (profileImageUri) {
      await saveUserProfile();
      navigation.navigate("Welcome");
    } else {
      alert("Failed to upload image, please try again.");
    }
  };

  return (
    <View>
      <Text style={styles.title}>Create your profile</Text>
      <Text style={{ marginLeft: 30 }}>Display name</Text>
      <View style={{ marginLeft: 20, marginBottom: 15, width: 465 }}>
        <InputField value={displayName} onChangeText={setDisplayName} />
      </View>
      <Text style={{ textAlign: "center", marginBottom: 10 }}>
        Upload your profile picture
      </Text>
      <View style={styles.Button}>
        <Button title="Select Photo" onPress={selectImage} />
        {isLoading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          profileImageUri && (
            <Image
              source={{ uri: profileImageUri }}
              style={styles.profileImage}
            />
          )
        )}
      </View>
      <Text style={{ marginLeft: 20 }}>Your bio</Text>
      <View style={{ alignItems: "center" }}>
        <TextInput
          multiline
          numberOfLines={7}
          value={bio}
          onChangeText={setBio}
          style={styles.bioInput}
        />
      </View>
      <View style={{ marginLeft: 19 }}>
        <Text>Location</Text>
        <View style={{ height: "40%" }}>
          <GooglePlacesAutocomplete
            placeholder={"Location"}
            onPress={(data, details = null) => {
              console.log("Selected data: ", data);
              console.log("Detailed data: ", details);
              setLocation(details?.formatted_address || data.description);
            }}
            query={{
              key: "AIzaSyAAjbI7mGn0f3MnGmadRfSgRcUrDgaPC4k",
              language: "en",
              types: "(cities)",
            }}
            onFail={(error) => console.log(error, "qwerwqer")}
            onNotFound={(data) => console.log(data, "aaaa")}
            styles={{
              textInputContainer: {
                width: "95%",
                backgroundColor: "transparent",
                borderTopWidth: 0,
                borderBottomWidth: 0,
                borderRadius: 40,
              },
              textInput: {
                height: 48,
                color: "#5d5d5d",
                fontSize: 16,
                borderRadius: 10,
                borderColor: "#CCC",
                borderWidth: 1,
                paddingLeft: 10,
              },
            }}
          />
        </View>
        <CustomButton
          style={styles.DoneButton}
          title="Done"
          onPress={goToWelcomeScreen}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    textAlign: "center",
    marginTop: 30,
    marginBottom: 15,
  },
  Button: {
    alignItems: "center",
  },
  bioInput: {
    width: "90%",
    textAlignVertical: "top",
    minHeight: 100,
    borderColor: "gray",
    borderWidth: 1,
    padding: 10,
    textAlignVertical: "top",
    marginBottom: 20,
    borderRadius: 20,
  },
  DoneButton: {
    marginTop: -40,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: "90%",
    marginLeft: 12,
  },
});
