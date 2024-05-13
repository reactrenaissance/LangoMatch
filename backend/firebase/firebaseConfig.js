import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';


const firebaseConfig = {
    apiKey: "AIzaSyBOpty97YQPUA6cT2GEQ-zQ96D0xTNDVMY",
    authDomain: "langomatch-595aa.firebaseapp.com",
    projectId: "langomatch-595aa",
    storageBucket: "langomatch-595aa.appspot.com",
    messagingSenderId: "499932750730",
    appId: "1:499932750730:web:5f0fd59412ec8544a4de73"
};

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
});

const db = getFirestore(app);

const storage = getStorage(app)

export { auth, db, storage }


  
