import { FirebaseApp, initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDwEGLH9D7SgN7Ed7ZQ-Pa_LfmmXa92U40",
    authDomain: "tccparkinson-8bd90.firebaseapp.com",
    projectId: "tccparkinson-8bd90",
    storageBucket: "tccparkinson-8bd90.appspot.com",
    messagingSenderId: "411599659859",
    appId: "1:411599659859:web:0841a69ec590dc290cf7a6"
};

export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIRESTORE_DB = getFirestore(FIREBASE_APP);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP)



