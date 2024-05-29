
import {Text, View, StyleSheet, Button, Image } from 'react-native';
import Card from '../../authentication/components/RouletteCards';
import Swiper from "react-native-deck-swiper";
import React, { useEffect, useState }  from 'react';
import { db } from '../../../backend/firebase/firebaseConfig';
import { collection, where, query, getDocs } from '@firebase/firestore';

const PartnerRoulette = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            const q = query(collection(db, "users"), where("isAvailable", "==", true))
            const querySnapshot = await getDocs(q);
            const fetchedUsers = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
            setUsers(fetchedUsers)
        };
        fetchUsers();
    }, []);
console.log(users, '===>usersssss')
    return (
        // <View style={styles.paigeContainer} >
        //     {users.map(user => (
        //         <Card key={user.id} user={user} />
        //     ))}
        // </View>
        <View style={styles.container}>
            {/* users.length > 0 OR  !!users?.length*/}
        {users.length > 0 && <Swiper
            cards={users}
            keyExtractor={user => user.id}
            // infinite={false}
            renderCard={(user, cardIndex) => {
                console.log(cardIndex)
                return (
                    <Card key={user.id} user={user} />
                )
            }}
            // showSecondCard={false}
            
            onSwiped={(cardIndex) => {console.log(cardIndex)}}
            onSwipedAll={() => {console.log('onSwipedAll')}}
            cardIndex={0}
            // backgroundColor={'red'}
            stackSize= {3}
            stackDepth={2}
            >
            <Button
                onPress={() => {console.log('oulala')}}
                title="Press me">
                You can press me
            </Button>
        </Swiper>}
    </View>
    );
};

export default PartnerRoulette;

const styles = StyleSheet.create({
    paigeContainer: { 
        justifyContent: 'center', 
        alignItems: 'center', 
        flex: 1  
    },
    container: {
        flex: 1,
        backgroundColor: "#F5FCFF"
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
        backgroundColor: "transparent"
      }
})