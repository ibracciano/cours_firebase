import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
    apiKey: "AIzaSyC4LciiePNK37OUbe8C3zUlD1pxFKi1E-0",
    authDomain: "fir-project-one-14f27.firebaseapp.com",
    projectId: "fir-project-one-14f27",
    storageBucket: "fir-project-one-14f27.appspot.com",
    messagingSenderId: "435250579564",
    appId: "1:435250579564:web:c025cb1a49e00ae182f049"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// authentification
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider()

// Base de données
export const db = getFirestore(app)

// le storage
export const storage = getStorage(app)