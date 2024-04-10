// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-analytics.js";
import { ref, getStorage, uploadBytes, getMetadata, deleteObject, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-storage.js";
// Import the functions for Firebase Realtime Database
import { getDatabase, ref as databaseRef, get, child } from 'https://www.gstatic.com/firebasejs/10.10.0/firebase-database.js';

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

// Function to parse URL parameters
function getUrlParameter(name) {
    name = name.replace(/[[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// Fetch username from URL
const username = getUrlParameter('username');

// Print the username to the console
console.log("Username:", username);

// Function to fetch email from Firebase Realtime Database based on username
function fetchEmailFromDatabase(username) {
  const db = getDatabase();
  const usersRef = child(databaseRef(db), 'users');

  // Query the database for the user with the given username
  return get(usersRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const userData = snapshot.val();
        // Check if the username exists in the database
        if (userData.hasOwnProperty(username)) {
          // Username found, return the email associated with it
          return userData[username].email;
        } else {
          // Username not found
          return null;
        }
      } else {
        // No data found in the database
        return null;
      }
    })
    .catch((error) => {
      console.error("Error fetching email:", error);
      return null;
    });
}

// Function to update the email displayed in the HTML
function updateEmailInHTML(email) {
  const emailElement = document.querySelector('.email-address');
  if (emailElement) {
    emailElement.textContent = email;
  }
}

// Usage: Fetch email based on username and update the HTML
fetchEmailFromDatabase(username)
  .then((email) => {
    if (email) {
      console.log(`Email for username '${username}': ${email}`);
      // Update the email displayed in the HTML
      updateEmailInHTML(email);
    } else {
      console.log(`No email found for username '${username}'`);
      // Handle case where username doesn't exist
    }
  })
  .catch((error) => {
    console.error("Error fetching email:", error);
  });
