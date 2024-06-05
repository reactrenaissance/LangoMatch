
import {Text, View, StyleSheet, Button, Image } from 'react-native';
import Card from '../../authentication/components/RouletteCards';
import CustomButton from '../../authentication/components/CustomButton';
import Swiper from "react-native-deck-swiper";
import React, { useEffect, useState }  from 'react';
import { db, auth } from '../../../backend/firebase/firebaseConfig';
import { collection, where, query, getDocs, addDoc, serverTimestamp } from '@firebase/firestore';


const PartnerRoulette = ({backgroundColor, navigation }) => {
    const [users, setUsers] = useState([]);
    const [allSwiped, setAllSwiped] = useState(false)

    const handleSwipedAll = () => {
        console.log('All cards have been swiped!');
        setAllSwiped(true);
    };


        const fetchUsers = async () => {
            const q = query(collection(db, "users"), where("isAvailable", "==", true))
            const querySnapshot = await getDocs(q);
            const fetchedUsers = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
            setUsers(fetchedUsers)
            setAllSwiped(false);
        };
   


    useEffect(() => {
        fetchUsers();
    }, []);


console.log(users, '===>usersssss')

    const resetDeck= () => {
        console.log('Resetting deck');
        fetchUsers();
    };

    const handleSwipe = (direction, swipedOnId) => {
        const swipedBy = getCurrentUserId();
        if (direction == 'right') {
            checkForMatch(swipedBy, swipedOnId);
        }
        addDoc(collection(db, 'Swipes'), {
            swipedBy,
            swipedOn: swipedOnId,
            direction,
            timestamp: serverTimestamp()  
                }).then(docRef => {
                console.log("Document written with ID: ", docRef.id);
                }).catch(error => {
                console.error("Error adding document: ", error);
        });
    };

    

    const getCurrentUserId = () => {
        return auth.currentUser ? auth.currentUser.uid : null;
    };

    const goToChat = (chatId) => {
    navigation.navigate('Chat Screen', { chatId, asd: 'qereqwrqwer' });
};


    const checkForMatch = async (swipedBy, swipedOnId) => {
        const matchQuery = query(
            collection(db, 'Swipes'), 
            where('swipedBy', '==', swipedOnId),
            where('swipedOn', '==', swipedBy),
            where('direction', '==', 'right')
        )
        try {
            const response = await getDocs(matchQuery);
            if (!response.empty) {
                navigation.navigate('User Details Screen', { userId: swipedOnId });
            }
        } catch (error) {
            console.error("Failed to check for matches:", error);
        } finally {
            goToChat(swipedOnId);
        }     
    };

    return (

        <View style={styles.container}>
        {users.length > 0 && !allSwiped ? ( <Swiper
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
            onSwipedLeft={(cardIndex) => handleSwipe('left', users[cardIndex].id)}
            onSwipedRight={(cardIndex) => handleSwipe('right', users[cardIndex].id)}

            onSwiped={(cardIndex) => {console.log(cardIndex)}}
            onSwipedAll={() => {
                console.log('onSwipedAll')
                handleSwipedAll();
        }}
            cardIndex={0}
            stackSize= {3}
            backgroundColor={backgroundColor}
            onTapCard={(cardIndex) => navigation.navigate('User Details Screen', { user: users[cardIndex] }) }
            />
    ) : (
            <View style={styles.noMoreCardsLeft}>
                <Text style={styles.noOne} >No one left...</Text>
            <CustomButton
                onPress={resetDeck}
                title="Give them another chance!"> 
            </CustomButton>
            </View>
        )}
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
        // backgroundColor: "white"
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
        backgroundColor: "transparent",
      },
      noMoreCardsLeft: {
        alignItems: 'center',
        marginVertical: 230,
        height: 30,
      },
      noOne: {
        paddingBottom: 10,
      }
})