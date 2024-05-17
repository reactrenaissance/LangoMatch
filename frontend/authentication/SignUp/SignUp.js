import {Text, View, StyleSheet} from 'react-native'
import InputField from '../components/InputField'
import CustomButton from '../components/CustomButton'
import { useState } from 'react'
import languages from '../components/languages'
import { MultipleSelectList } from 'react-native-dropdown-select-list'
import { ScrollView } from 'react-native'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../../backend/firebase/firebaseConfig'


export default function SignUp({ navigation }) {


    const [selectedLanguages, setSelectedLanguages] = useState([]);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    console.log(languages)

    const validateEmail = (email) => {
        return email.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
    };

    const validatePassword = (password) => {
        return password.length >= 8;
    };

    const handleSignUp = () => {
        if (!validateEmail(email)) {
            alert('Please enter a valid email address.');
            return;
        }
    
        if (!validatePassword(password)) {
            alert('Password must be at least 8 characters long.');
            return;
        }
    
        createUserWithEmailAndPassword(auth, email, password)
            .then(userCredentials => {
                console.log('User registered with UID:', userCredentials.user.uid);
                handlePostSignUp(userCredentials.user);
            })
            .catch(error => {
                console.error('Error during sign up:', error);
                handleSignUpError(error);
            });
    };
    
    const handlePostSignUp = (user) => {
        // Log more details about the user
        console.log(`User details: Email: ${user.email}, UID: ${user.uid}`);
        // Proceed to check the authentication state and navigate accordingly
        auth.onAuthStateChanged((user) => {
            if (user) {
                console.log(`User is signed in as ${user.email}`);
                navigation.navigate('Onboarding');
            } else {
                console.log("No user is signed in after sign up.");
            }
        });
    };
    
    const handleSignUpError = (error) => {
        if (error.code === 'auth/email-already-in-use') {
            alert('This email address is already in use.');
        } else {
            alert(`Error signing up: ${error.message}`);
        }
    };
    


    return (
        <ScrollView>
        <View style={styles.container}>
            <Text style={styles.signUpText}>Sign up </Text>
            <View style={styles.inputContainer}>
                <InputField 
                placeholder={"Email Address"}  
                value={email}
                onChangeText={setEmail}
                />
                <InputField 
                placeholder={'Password'} 
                value={password}
                onChangeText={setPassword}
                secureTextEntry={true} 
                />
                <Text>I am native in</Text>
                <View style={{width: '75%'}}>
                    <MultipleSelectList selected={selectedLanguages} 
                    setSelected={(value) => setSelectedLanguages(value) } 
                    data={languages} style={{ height: 200,marginBottom: 45, 
                    marginTop: 8, flex: 1, height: 200, 
                    backgroundColor: '#fff' }} />
                </View>
                <InputField placeholder={"Skype"} />
                <InputField placeholder={"Whatsapp"} />
            </View>
            <View style={styles.signUpContainer}>
            <CustomButton 
            style={styles.signUpButton} 
            title={"Sign Up"} 
            onPress={handleSignUp}
            />
            </View>
        </View>
        </ScrollView>
    )
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fffff',
        flex: 1,
        marginVertical: 22,
    },
    signUpText: {
        marginLeft: 20,
        fontSize: 20,
        fontWeight: 'bold',
    },
    inputContainer: {
        alignItems: 'center',
        marginTop: 30,
    },
    signUpContainer: {
        alignItems: 'center',
    },
    signUpButton: {
        width: '75%',
        borderRadius: 20,
    },
    pickerStyle: {
        width: '75%'
    }
});