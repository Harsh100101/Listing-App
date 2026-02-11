// Quick Start: Switch from Offline to Firebase Mode
// Follow these steps to enable Firebase in your app

// ============================================
// STEP 1: Configure Firebase
// ============================================
// 1. Open app/config/firebase.js
// 2. Replace placeholders with your Firebase project credentials
// 3. Get credentials from: https://console.firebase.google.com/
//    Project Settings > General > Your apps > Config

// ============================================
// STEP 2: Update App.js (Choose ONE option)
// ============================================

// OPTION A: Full Firebase Mode (Recommended)
// Replace in App.js:

/*
import { AuthProvider, useAuth } from "./app/auth";

export default function App() {
  return (
    <AuthProvider>
      ...
    </AuthProvider>
  );
}
*/

// With:

/*
import { FirebaseAuthProvider, useFirebaseAuth } from "./app/auth/firebaseContext";

export default function App() {
  return (
    <FirebaseAuthProvider>
      ...
    </FirebaseAuthProvider>
  );
}
*/

// ============================================
// STEP 3: Update Screens
// ============================================

// In LoginScreen.js, RegisterScreen.js, AccountScreen.js:
// Replace:
// const { login, logout, register } = useAuth();
// With:
// const { login, logout, register } = useFirebaseAuth();

// ============================================
// STEP 4: Update Listings API
// ============================================

// In ListingScreen.js, ListingEditScreen.js, MyListingsScreen.js:
// Replace:
// import listingApi from "../api/listings";
// With:
// import listingApi from "../api/firebaseListings";

// ============================================
// STEP 5: Enable Firebase Services
// ============================================
// Go to Firebase Console and enable:
// 1. Authentication > Email/Password
// 2. Firestore Database > Create database (test mode)
// 3. Cloud Messaging > Enable
// 4. Storage > Enable (test mode)

// See FIREBASE_SETUP.md for detailed instructions

// ============================================
// STEP 6: Test
// ============================================
// 1. Restart the app
// 2. Register a new user
// 3. Login
// 4. Create a listing
// 5. Check Firebase Console > Firestore to see data

// ============================================
// Files You Need to Update
// ============================================
/*
1. app/config/firebase.js - Add your Firebase config
2. App.js - Switch to FirebaseAuthProvider
3. app/screen/LoginScreen.js - Use useFirebaseAuth
4. app/screen/RegisterScreen.js - Use useFirebaseAuth
5. app/screen/AccountScreen.js - Use useFirebaseAuth
6. app/screen/ListingScreen.js - Use firebaseListings API
7. app/screen/ListingEditScreen.js - Use firebaseListings API
8. app/screen/MyListingsScreen.js - Use firebaseListings API
9. app/screen/ListingDetailsScreen.js - Update messaging (optional)
*/

export default {};
