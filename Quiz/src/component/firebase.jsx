import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, setPersistence, browserLocalPersistence } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAArmozksjcFyn9uqEvfO3miPNGSqp8ogo",
    authDomain: "quiz1-8be7e.firebaseapp.com",
    projectId: "quiz1-8be7e",
    storageBucket: "quiz1-8be7e.appspot.com",
    messagingSenderId: "628770688968",
    appId: "1:628770688968:web:3a78d9e0a4ee68e2b43afd",
    measurementId: "G-GCRE9X4FLT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Set persistence
setPersistence(auth, browserLocalPersistence)
    .catch((error) => {
        console.error("Error setting auth persistence:", error);
    });

export { auth, provider };
export const db = getFirestore(app);
