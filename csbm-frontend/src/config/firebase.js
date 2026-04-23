import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Replace with your actual Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyAJuRg31dFomfwp_4qs54Wrlwer3FyaVjk",
  authDomain: "csbm-cdca6.firebaseapp.com",
  projectId: "csbm-cdca6",
  storageBucket: "csbm-cdca6.firebasestorage.app",
  messagingSenderId: "376961844711",
  appId: "1:376961844711:web:c596326efade60b4076942",
  measurementId: "G-0GK6WS2H6M"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export auth and providers
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
