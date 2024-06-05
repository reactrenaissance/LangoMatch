import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

export default function UserDetailsScreen({ route, navigation }) {
    const { user, handleSwipeLeft, handleSwipeRight } = route.params;


    return (
        <View style={styles.container} >
            <Image style={styles.image} source={{ uri: user?.profileImageUri }} />
            <Text style={styles.name} >{user.displayName}</Text>
            <Text style={styles.location} >{user.location}</Text>
            <Text style={styles.bio} >{user.bio}</Text>
            <View style={styles.row} >
                <TouchableOpacity
                onPress={() => handleSwipeLeft(user.id)} 
                style={[styles.button, { backgroundColor: 'grey' }]}
                >
                    <Text>X</Text>
                </TouchableOpacity>
                <TouchableOpacity
                onPress={() => handleSwipeRight(user.id)} 
                style={[styles.button, { backgroundColor: 'white', borderWidth: 1, borderColor: 'red' }]}
                >
                    <Text>♥</Text>
                </TouchableOpacity>
            {/* <CustomButton 
                title="X" 
                onPress={handleSwipeLeft} 
                style={[styles.button, { backgroundColor: 'grey' }]} 
            />

            <CustomButton 
                title=" ♥ " 
                onPress={handleSwipeRight} 
                style={[styles.button, { backgroundColor: 'white', }]} 
            /> */}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 40,
        marginLeft: 5,
    },
    image: {
        width: '99%',
        height: '70%',
        borderRadius: 20,
        alignItems: 'center',
    },
    name: {
        fontSize: 22,
    },
    location: {
        fontSize: 10,
        marginVertical: 5,
    },
    bio: {
        fontSize: 13,
        marginBottom: 20,
    },
    button: {
        width: 50,
        height: 50,
        borderRadius: 90,
        borderBlockEndColor: 'red',
        alignItems: 'center',
        justifyContent: 'center'
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    }
})