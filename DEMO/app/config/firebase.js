// Firebase Configuration
// ⚠️ IMPORTANT: Never commit real API keys to version control!
// Create a .env file or use Expo's environment variables

const firebaseConfig = {
	apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "your-api-key-here",
	authDomain:
		process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ||
		"your-project.firebaseapp.com",
	projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "your-project-id",
	storageBucket:
		process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ||
		"your-project.firebasestorage.app",
	messagingSenderId:
		process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
	appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "your-app-id",
	measurementId:
		process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-XXXXXXXXXX",
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
