import { updateDoc, doc } from "@firebase/firestore";
import { Text, View } from 'react-native';
import InputField from "../../authentication/components/InputField";
import { useState } from "react";

const ProfileSettings = () => {
    const [newName, setNewName] = useState();
    const [newBio, setNewBio] = useState();
    const [newEmail, setNewEmail] = useState();
    const [newPassword, setNewPassword] = useState();
    const [newLocation, setNewLocation] = useState();

    const handleUpdateProfile = async () => {}

    return (
        <View>
            {/* Implement Edit image and save button */}
            <Text>Your name</Text>
            <InputField value={newName} onChangeText={setNewName}/>
            <Text>Your bio</Text>
            <InputField value={newBio} onChangeText={setNewBio}/>
            <Text>Your email</Text>
            <InputField value={newEmail} onChangeText={setNewEmail}/>
            <Text>Your password</Text>
            <InputField secureTextEntry={true} value={newPassword} onChangeText={setNewPassword}/>
            <Text>Your location</Text>
            <InputField  value={newLocation} onChangeText={setNewLocation}/>
        </View>
    )
}

export default ProfileSettings;