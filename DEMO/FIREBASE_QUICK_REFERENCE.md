# 🎯 Firebase Quick Reference Card

## 📌 Essential Links

| Service              | URL                                                      |
| -------------------- | -------------------------------------------------------- |
| **Firebase Console** | https://console.firebase.google.com/                     |
| **Documentation**    | https://firebase.google.com/docs                         |
| **Your Project**     | https://console.firebase.google.com/project/[PROJECT_ID] |

---

## ✅ Setup Checklist

### Firebase Console Setup

- [ ] Project created
- [ ] Authentication > Email/Password enabled
- [ ] Firestore Database created
- [ ] Cloud Messaging enabled
- [ ] Storage enabled
- [ ] Web app registered
- [ ] Config copied to `app/config/firebase.js`

### Database Details

```
Database ID: (default)
Location: _____________ (e.g., asia-south1)
```

### Code Migration

- [ ] App.js → FirebaseAuthProvider
- [ ] LoginScreen.js → useFirebaseAuth
- [ ] RegisterScreen.js → useFirebaseAuth
- [ ] AccountScreen.js → useFirebaseAuth
- [ ] ListingScreen.js → firebaseListings
- [ ] ListingEditScreen.js → firebaseListings + useFirebaseAuth
- [ ] MyListingsScreen.js → firebaseListings + useFirebaseAuth

---

## 🔑 Your Firebase Config

**Location:** `app/config/firebase.js`

```javascript
const firebaseConfig = {
	apiKey: "_____________________",
	authDomain: "_____________________",
	projectId: "_____________________",
	storageBucket: "_____________________",
	messagingSenderId: "_____________________",
	appId: "_____________________",
	measurementId: "_____________________",
};
```

---

## 📱 Import Changes Reference

### Authentication

```javascript
// OLD
import { useAuth } from "../auth";
const { user, login, logout } = useAuth();

// NEW
import { useFirebaseAuth } from "../auth/firebaseContext";
const { user, login, logout } = useFirebaseAuth();
```

### Listings API

```javascript
// OLD
import listingApi from "../api/listings";

// NEW
import listingApi from "../api/firebaseListings";
```

### App Provider

```javascript
// OLD
import { AuthProvider } from "./app/auth";
<AuthProvider>...</AuthProvider>;

// NEW
import { FirebaseAuthProvider } from "./app/auth/firebaseContext";
<FirebaseAuthProvider>...</FirebaseAuthProvider>;
```

---

## 🏗️ Firestore Collections Structure

### `listings` Collection

```javascript
{
  id: "auto-generated-id",
  title: "Red Jacket",
  price: 100,
  description: "Nice jacket",
  category: { label: "Clothing", value: 5 },
  images: [{ url: "...", thumbnailUrl: "..." }],
  location: { latitude: 12.34, longitude: 56.78 },
  userId: "firebase-uid",
  userName: "John Doe",
  userEmail: "john@example.com",
  createdAt: ServerTimestamp
}
```

### `messages` Collection

```javascript
{
  id: "auto-generated-id",
  listingTitle: "Red Jacket",
  message: "Is this available?",
  senderId: "firebase-uid",
  senderName: "John Doe",
  recipientId: "seller-uid",
  listingId: "listing-id",
  createdAt: ServerTimestamp
}
```

### `users` Collection

```javascript
{
  id: "firebase-uid",
  fcmToken: "ExponentPushToken[...]",
  lastTokenUpdate: Timestamp
}
```

---

## 🛡️ Security Rules

### Firestore Rules (Test Mode - 30 days)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.time < timestamp.date(2026, 3, 12);
    }
  }
}
```

### Firestore Rules (Production - Secure)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /listings/{listing} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth.uid == resource.data.userId;
    }
    match /messages/{message} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
    }
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
  }
}
```

### Storage Rules (Test Mode)

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.time < timestamp.date(2026, 3, 12);
    }
  }
}
```

### Storage Rules (Production)

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /listings/{userId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
  }
}
```

---

## 🧪 Testing Commands

### Clear Cache & Restart

```bash
npx expo start -c
```

### Check for Errors

```bash
npx expo doctor
```

### Rebuild

```bash
npx expo prebuild --clean
```

---

## 🐛 Common Errors & Fixes

| Error                       | Fix                                                  |
| --------------------------- | ---------------------------------------------------- |
| `invalid-api-key`           | Check firebase.js config                             |
| `Missing permissions`       | Update Firestore rules                               |
| `undefined user`            | Check auth state, may not be logged in               |
| `Cannot read property 'id'` | Firebase uses `uid`, change to `user.id` in our code |
| `Network error`             | Check internet connection                            |
| `App crashes on start`      | Clear cache: `npx expo start -c`                     |

---

## 📊 Firebase Console Navigation

```
Firebase Console
├── Project Overview (Home)
├── Build
│   ├── Authentication
│   │   ├── Users (see registered users)
│   │   └── Sign-in method (enable providers)
│   ├── Firestore Database
│   │   ├── Data (view collections)
│   │   └── Rules (security rules)
│   ├── Storage
│   │   ├── Files (uploaded images)
│   │   └── Rules (security rules)
│   └── Cloud Messaging
└── Project Settings (gear icon)
    ├── General (project details)
    └── Your apps (web app config)
```

---

## 🎯 Verification Steps

### After Firebase Setup:

1. ✅ Can see project in Firebase Console
2. ✅ Authentication shows Email/Password enabled
3. ✅ Firestore shows empty database ready
4. ✅ Config copied to firebase.js

### After Code Migration:

1. ✅ App starts without errors
2. ✅ Can register new user
3. ✅ User appears in Firebase Console > Authentication
4. ✅ Can login with registered user
5. ✅ Can create listing
6. ✅ Listing appears in Firestore > listings collection
7. ✅ Feed shows listings
8. ✅ My Listings shows only user's listings

---

## 📞 Support Resources

| Need Help With | Resource                            |
| -------------- | ----------------------------------- |
| Firebase Setup | `FIREBASE_STEP_BY_STEP.md`          |
| Code Migration | `FIREBASE_CODE_MIGRATION.md`        |
| Complete Guide | `FIREBASE_README.md`                |
| API Reference  | Check `app/services/` folder        |
| Authentication | `app/services/firebaseAuth.js`      |
| Database       | `app/services/firebaseFirestore.js` |
| Messaging      | `app/services/firebaseMessaging.js` |

---

## 🔥 Firebase Services Status

Check your services are enabled:

```
✅ Authentication     → https://console.firebase.google.com/project/[PROJECT]/authentication
✅ Firestore          → https://console.firebase.google.com/project/[PROJECT]/firestore
✅ Cloud Messaging    → https://console.firebase.google.com/project/[PROJECT]/messaging
✅ Storage            → https://console.firebase.google.com/project/[PROJECT]/storage
```

Replace `[PROJECT]` with your project ID

---

**Print this page or keep it open for quick reference! 📄**
