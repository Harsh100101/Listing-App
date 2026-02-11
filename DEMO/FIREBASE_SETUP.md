# Firebase Setup Guide

## 🔥 Firebase Configuration

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name (e.g., "DoneWithIt")
4. Follow the setup wizard

### Step 2: Get Firebase Configuration

1. In Firebase Console, click the gear icon ⚙️ > Project Settings
2. Scroll to "Your apps" section
3. Click the web icon `</>` to add a web app
4. Register your app with a nickname
5. Copy the `firebaseConfig` object
6. Paste it into `app/config/firebase.js`

### Step 3: Enable Firebase Services

#### Authentication

1. Go to **Build** > **Authentication**
2. Click "Get started"
3. Enable **Email/Password** sign-in method
4. Click "Save"

#### Firestore Database

1. Go to **Build** > **Firestore Database**
2. Click "Create database"
3. Choose **Start in test mode** (for development)
4. Select a location (choose closest to your users)
5. Click "Enable"

**Security Rules (for development):**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

#### Cloud Messaging (Push Notifications)

1. Go to **Build** > **Cloud Messaging**
2. Click "Get started"
3. No additional configuration needed for basic setup

#### Storage (for images)

1. Go to **Build** > **Storage**
2. Click "Get started"
3. Choose **Start in test mode**
4. Click "Next" and "Done"

**Security Rules (for development):**

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

---

## 📱 App Integration

### Option 1: Switch Entirely to Firebase (Recommended)

**Update App.js:**

```javascript
import { FirebaseAuthProvider } from "./app/auth/firebaseContext";

export default function App() {
	return (
		<FirebaseAuthProvider>
			{" "}
			{/* Changed from AuthProvider */}
			<OfflineNotice />
			<GestureHandlerRootView style={{ flex: 1 }}>
				<RootNavigation />
			</GestureHandlerRootView>
		</FirebaseAuthProvider>
	);
}
```

**Update screens to use Firebase:**

```javascript
// In LoginScreen.js, RegisterScreen.js, etc.
import { useFirebaseAuth } from "../auth/firebaseContext";

function LoginScreen() {
	const { login } = useFirebaseAuth(); // Changed from useAuth
	// ... rest of the code
}
```

**Update listings API:**

```javascript
// Change imports from:
import listingApi from "../api/listings";
// To:
import listingApi from "../api/firebaseListings";
```

### Option 2: Hybrid Approach (Firebase + Offline Fallback)

Keep existing offline functionality and add Firebase sync capabilities.

---

## 🔔 Push Notifications Setup

### Expo Project ID

1. Run: `npx expo whoami` to check logged-in account
2. Run: `npx eas init` to create/link Expo project
3. Copy your project ID from `app.json` or Expo dashboard
4. Update in `app/services/firebaseMessaging.js`:

```javascript
const tokenData = await Notifications.getExpoPushTokenAsync({
	projectId: "YOUR_EXPO_PROJECT_ID", // Replace this
});
```

### Test Push Notifications

```javascript
import { sendLocalNotification } from "./app/services/firebaseMessaging";

// Test notification
await sendLocalNotification("Test Title", "Test Message");
```

---

## 📊 Firestore Data Structure

### Collections

**listings**

```javascript
{
  id: "auto-generated",
  title: "Red Jacket",
  price: 100,
  description: "...",
  category: { label: "Clothing", value: 5, ... },
  images: [
    { url: "...", thumbnailUrl: "..." }
  ],
  location: { latitude: 12.34, longitude: 56.78 },
  userId: "firebase-user-id",
  userName: "John Doe",
  userEmail: "john@example.com",
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

**messages**

```javascript
{
  id: "auto-generated",
  listingTitle: "Red Jacket",
  message: "Is this still available?",
  senderId: "firebase-user-id",
  senderName: "John Doe",
  recipientId: "seller-user-id",
  createdAt: Timestamp
}
```

**users** (for FCM tokens)

```javascript
{
  id: "firebase-user-id",
  fcmToken: "ExponentPushToken[...]",
  lastTokenUpdate: Timestamp
}
```

---

## 🔧 Testing

### 1. Test Authentication

```javascript
// Register
await register("test@example.com", "password123", "Test User");

// Login
await login("test@example.com", "password123");

// Logout
await logout();
```

### 2. Test Firestore

Go to Firebase Console > Firestore Database to see data in real-time

### 3. Monitor Logs

Check the console for Firebase operations with devLog messages

---

## 🚀 Production Security

Before deploying to production:

### 1. Update Firestore Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own data
    match /listings/{listing} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth.uid == resource.data.userId;
    }

    match /messages/{message} {
      allow read: if request.auth != null &&
        (request.auth.uid == resource.data.senderId ||
         request.auth.uid == resource.data.recipientId);
      allow create: if request.auth != null;
    }

    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
  }
}
```

### 2. Update Storage Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /listings/{userId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 3. Enable App Check (optional but recommended)

Protects your backend resources from abuse.

---

## 🐛 Troubleshooting

**Error: "Firebase: Error (auth/invalid-api-key)"**

- Check `app/config/firebase.js` has correct API key

**Error: "Missing or insufficient permissions"**

- Update Firestore security rules to allow read/write

**Push notifications not working**

- Only work on physical devices, not simulators
- Check permissions granted
- Verify Expo project ID is correct

**Data not showing in Firestore**

- Check internet connection
- Verify Firestore is enabled in Firebase Console
- Check browser console in Firestore tab for real-time updates

---

## 📚 Additional Resources

- [Firebase Docs](https://firebase.google.com/docs)
- [Expo Notifications](https://docs.expo.dev/versions/latest/sdk/notifications/)
- [React Native Firebase](https://rnfirebase.io/)
- [Firestore Best Practices](https://firebase.google.com/docs/firestore/best-practices)
