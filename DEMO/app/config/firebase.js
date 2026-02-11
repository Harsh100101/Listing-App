// Firebase Configuration
// Replace these values with your actual Firebase project credentials
// Get them from: Firebase Console > Project Settings > General > Your apps

const firebaseConfig = {
	apiKey: "AIzaSyD6HeRsfNAMse8yiskspfd4U1Jke0qMAB8",
	authDomain: "fir-fbfae.firebaseapp.com",
	projectId: "fir-fbfae",
	storageBucket: "fir-fbfae.firebasestorage.app",
	messagingSenderId: "84279272797",
	appId: "1:84279272797:web:dd9683cef2c87c13b574b4",
	measurementId: "G-1R5MLV91GL",
};

// Export the config for use in services/firebase.js
export default firebaseConfig;

// SETUP INSTRUCTIONS:
// 1. Go to https://console.firebase.google.com/
// 2. Create a new project or select an existing one
// 3. Click "Add app" and select the web platform (</>) or iOS/Android
// 4. Register your app and copy the config values above
// 5. Enable Authentication > Sign-in method > Email/Password
// 6. Enable Firestore Database > Create database (start in test mode)
// 7. Enable Cloud Messaging
// 8. Enable Storage > Start in test mode
