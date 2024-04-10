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

// Debug: Print out location.search to see if it captures the query string correctly
console.log('location.search:', location.search);

// Fetch username from URL
const username = getUrlParameter('username');

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
      console.error("Error fetching user data:", error);
      return null;
    });
}

// Event listener for form submission
document.addEventListener('DOMContentLoaded', function() {
  const purposeForm = document.getElementById('purposeForm');
  purposeForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission

    // Usage: Fetch email based on username
    fetchEmailFromDatabase(username)
      .then((email) => {
        if (email) {
          console.log(`Email for username '${username}': ${email}`);
          // Redirect to verification.html with the email as a URL parameter
          window.location.href = `verification.html?username=${username}`;
        } else {
          console.log(`No email found for username '${username}'`);
          // Handle case where username doesn't exist
        }
      })
      .catch((error) => {
        console.error("Error fetching email:", error);
      });
  });
});

//back button
document.addEventListener('DOMContentLoaded', function() {
    const backButton = document.getElementById('backButton');
    backButton.addEventListener('click', function() {
        // Add logic here to navigate back to the previous page
        window.history.back();
    });
});

//border change
document.addEventListener('DOMContentLoaded', function() {
    // Select all radio buttons
    const radioButtons = document.querySelectorAll('input[type="radio"]');
  
    // Add event listener to each radio button
    radioButtons.forEach(function(radioButton) {
      radioButton.addEventListener('change', function() {
        // Remove "selected" class from all options
        document.querySelectorAll('.option').forEach(function(option) {
          option.classList.remove('selected');
        });
  
        // Add "selected" class to the parent option of the clicked radio button
        this.closest('.option').classList.add('selected');
      });
    });
});
