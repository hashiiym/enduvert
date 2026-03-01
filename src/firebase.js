import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth"; // Added for Login
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyA864TvlX80L3XlALvHornFZWvOI3k3o8I",
    authDomain: "enduvert.firebaseapp.com",
    projectId: "enduvert",
    storageBucket: "enduvert.firebasestorage.app",
    messagingSenderId: "641207834675",
    appId: "1:641207834675:web:9670035cc6c2220b502b46",
    measurementId: "G-6L60VY0630"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize and Export Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
