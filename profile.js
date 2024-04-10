// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-analytics.js";
import { ref, getStorage, uploadBytes, getMetadata, deleteObject, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-storage.js";
// Import the functions for Firebase Realtime Database
import { getDatabase, ref as databaseRef, set } from 'https://www.gstatic.com/firebasejs/10.10.0/firebase-database.js';

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

// Select the file input element
const fileInput = document.getElementById('avatar-upload');

// Select the image element in the avatar frame
const avatarImage = document.querySelector('.avatar-frame img');

// Select the location input element
const locationInput = document.querySelector('.location input');

// Add an event listener to the file input element
fileInput.addEventListener('change', function(event) {
    // Check if a file is selected
    if (event.target.files && event.target.files[0]) {
        // Read the selected file as a data URL
        const reader = new FileReader();
        reader.onload = function(e) {
            // Set the data URL as the source of the image element
            avatarImage.src = e.target.result;
        };
        reader.readAsDataURL(event.target.files[0]);
    }
});

// default images

// Get the modal
var modal = document.getElementById("default-modal");

// Get the close button
var closeBtn = document.getElementsByClassName("close")[0];

// Open the modal when default text is clicked
document.getElementById("default-text").addEventListener("click", function() {
  modal.style.display = "block";
});

// Close the modal when close button is clicked
closeBtn.onclick = function() {
  modal.style.display = "none";
}

// Close the modal when clicked outside of it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

// Select the default images
const defaultImages = document.querySelectorAll('.default-image');

// Add click event listeners to the default images
defaultImages.forEach(image => {
  image.addEventListener('click', function() {
    // Update the avatar image with the selected default image
    avatarImage.src = image.src;
    // Close the modal after selecting an image
    modal.style.display = "none";
  });
});

// Add event listener to the "Next" button
document.querySelector('.next').addEventListener('click', async (event) => {
  event.preventDefault(); // Prevent the form from submitting
  
  // Get the image source displayed in the avatar frame
  const imageSrc = avatarImage.src;
  
  // Convert the user-uploaded image source to Blob
  const response = await fetch(imageSrc);
  const blob = await response.blob();
  
  try {
      // Initialize Firebase Storage
      const storage = getStorage(app);
      
      // Create a reference to the storage location with username as filename
      const storageRef = ref(storage, `avatars/${username}.jpg`);
      
      try {
        // Check if the file exists
        await getMetadata(storageRef);
    
        // If the file exists, delete it
        await deleteObject(storageRef);
        console.log("Existing file deleted.");
    } catch (error) {
        // If the file doesn't exist, it's fine, continue
        if (error.code !== 'storage/object-not-found') {
            // Handle other errors if needed
            console.error("Error checking file existence:", error);
            return;
        }
    }
    
    // Proceed with uploading the new file
    try {
        // Upload the file to Firebase Storage
        const snapshot = await uploadBytes(storageRef, blob);
        console.log("User-uploaded file uploaded to Firebase Storage!");
        
        // Get the download URL of the uploaded image
        const downloadURL = await getDownloadURL(snapshot.ref);
        
        // Retrieve location value
        const location = locationInput.value;
        
        // Initialize Firebase Realtime Database
        const database = getDatabase();
        
        // Update the user's location and image URL in the database
        await Promise.all([
          set(databaseRef(database, `users/${username}/location`), location),
          set(databaseRef(database, `users/${username}/avatarURL`), downloadURL)
        ]);
        
        // Redirect to the next page
        window.location.href = `/purpose.html?username=${username}`;
    } catch (error) {
        // Handle any errors that occur during the upload process
        console.error("Error uploading user-uploaded file:", error);
    }
  } catch (error) {
      // Handle any errors that occur during the upload process
      console.error("Error uploading user-uploaded file:", error);
  }
});
