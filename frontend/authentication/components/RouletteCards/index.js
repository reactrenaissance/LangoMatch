import React from "react";
import { Text, View, StyleSheet, ImageBackground, Image } from "react-native";
import { db } from "../../../../backend/firebase/firebaseConfig";

const Card = ({ user }) => {
    return (
        <View style={styles.card}>
                <ImageBackground key={user.id} source={{
                    uri: user.profileImageUri
                    }}
                    style={styles.image}
                >
                <View style={styles.cardInner} >
                <Text style={styles.name} >{user.displayName}</Text>
                <Text style={styles.bio} >{user.bio}</Text>
                </View>
                </ImageBackground>
            </View>
    );
}

export default Card;

const styles = StyleSheet.create({
    image: { 
        width: '100%', 
        height: '100%', 
        borderRadius: 10,
        // overflow: 'hidden',
        justifyContent: 'flex-end',
    },
    card: {
        width: '100%',
        height: '95%',
        borderRadius: 10,
        overflow: 'hidden',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,

        elevation: 9
            },
    cardInner: {
        padding: 10
    },
    name: {
        fontSize: 30,
        color: 'white',
        fontWeight: 'bold',
        marginHorizontal: 10,
    },
    bio: {
        fontsize: 15,
        color: 'white',
        // lineHeight: 17,
        marginHorizontal: 10,
        marginBottom: 7,
    },
})