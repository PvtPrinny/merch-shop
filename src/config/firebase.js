// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from "firebase/auth";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDOgQK1Z-Ow2D-gUy99lKi3eTpm3gzs6yI",
  authDomain: "project1-551cd.firebaseapp.com",
  projectId: "project1-551cd",
  storageBucket: "project1-551cd.appspot.com",
  messagingSenderId: "601039046009",
  appId: "1:601039046009:web:ffdb6d27534626bb99dba8",
  measurementId: "G-1VYTJGVSG7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);