// Import Firebase Realtime Database
import { getDatabase, ref, child, get, set } from 'https://www.gstatic.com/firebasejs/10.10.0/firebase-database.js';

// Capture the form submission event
document.querySelector('form').addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    // Hide existing error messages
    document.getElementById('email-error').style.display = 'none';
    document.getElementById('username-error').style.display = 'none';

    // Retrieve form data
    const name = document.getElementById('Name').value;
    const username = document.getElementById('Username').value;
    const email = document.getElementById('Email').value;
    const password = document.getElementById('Password').value;

    // Check if email already exists
    const emailExists = await checkIfEmailExists(email);
    if (emailExists) {
        // Prompt user that email already exists
        document.getElementById('email-error').style.display = 'block';
        return;
    }

    // Check if username already exists
    const usernameExists = await checkIfUsernameExists(username);
    if (usernameExists) {
        // Prompt user that username already exists
        document.getElementById('username-error').style.display = 'block';
        return;
    }

    // Store user details in the database
    await saveUserData(name, username, email, password);

    console.log('Username:', username);
    window.location.href = `/profile.html?username=${username}`;
    
});

// Function to check if email already exists
async function checkIfEmailExists(email) {
    const database = getDatabase();
    const snapshot = await get(child(ref(database), 'users'));
    if (snapshot.exists()) {
        const users = snapshot.val();
        return Object.values(users).some(user => user.email === email);
    }
    return false;
}

// Function to check if username already exists
async function checkIfUsernameExists(username) {
    const database = getDatabase();
    const snapshot = await get(child(ref(database), 'users'));
    if (snapshot.exists()) {
        const users = snapshot.val();
        return Object.values(users).some(user => user.username === username);
    }
    return false;
}

// Function to save user data in the database
async function saveUserData(name, username, email, password) {
    const database = getDatabase();
    await set(ref(database, `users/${username}`), {
        name: name,
        username: username,
        email: email,
        password: password
    });
}
