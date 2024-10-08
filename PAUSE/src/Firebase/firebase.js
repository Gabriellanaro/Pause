import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth"; // Import getAuth and GoogleAuthProvider

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDPgfVqljzmCxX39zc0BpAxH9CqtnFk8bg",
    authDomain: "pause-eea79.firebaseapp.com",
    projectId: "pause-eea79",
    storageBucket: "pause-eea79.appspot.com",
    messagingSenderId: "106210069487",
    appId: "1:106210069487:web:584f77a6aedea84860841a",
    measurementId: "G-93R4VXQG95"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Initialize auth
const provider = new GoogleAuthProvider(); // Create an instance of GoogleAuthProvider

// Export auth and provider so they can be used in other files
export { auth, provider };