// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAWwnjU6tICKUz05lVbiYzKDLhVFTuCoFg",
  authDomain: "aeonaxy-b054a.firebaseapp.com",
  projectId: "aeonaxy-b054a",
  storageBucket: "aeonaxy-b054a.appspot.com",
  messagingSenderId: "634033896898",
  appId: "1:634033896898:web:e80bd70d57225458412a5b",
  measurementId: "G-WVDG7HTLKW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);