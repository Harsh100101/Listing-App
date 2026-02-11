# 🔥 Firebase Setup - Step-by-Step Guide

## Part 1: Create Firebase Project (3 minutes)

### Step 1.1: Go to Firebase Console

1. Open your browser and go to: **https://console.firebase.google.com/**
2. Sign in with your Google account
3. You'll see the Firebase Console homepage

### Step 1.2: Create New Project

1. Click the **"Create a project"** button (or **"Add project"**)
2. Enter project name: `DoneWithIt` (or any name you prefer)
3. Click **"Continue"**

### Step 1.3: Google Analytics (Optional)

1. Toggle OFF "Enable Google Analytics" (you can enable later)
   - OR keep it ON and select/create an Analytics account
2. Click **"Create project"**
3. Wait 30-60 seconds for project creation
4. Click **"Continue"** when ready

✅ **Project Created!** You're now in your Firebase project dashboard.

---

## Part 2: Enable Authentication (2 minutes)

### Step 2.1: Navigate to Authentication

1. In the left sidebar, click **"Build"**
2. Click **"Authentication"**
3. Click the **"Get started"** button

### Step 2.2: Enable Email/Password Sign-in

1. Click on the **"Sign-in method"** tab at the top
2. You'll see a list of providers (Google, Facebook, Email/Password, etc.)
3. Click on **"Email/Password"** row
4. Toggle **"Enable"** switch to ON (it will turn blue)
5. **IMPORTANT:** Leave "Email link (passwordless sign-in)" as DISABLED
6. Click **"Save"**

✅ **Authentication Enabled!**

**What you should see:**

- Email/Password row now shows "Enabled" status in green

---

## Part 3: Create Firestore Database (3 minutes)

### Step 3.1: Navigate to Firestore

1. In the left sidebar, click **"Build"**
2. Click **"Firestore Database"**
3. Click the **"Create database"** button

### Step 3.2: Security Rules (Choose Test Mode)

You'll see two options:

**Option 1: Production mode** ❌ (Don't choose this for now)

- Denies all reads/writes by default
- You'll need to write rules first

**Option 2: Test mode** ✅ (Choose this one)

- Allows read/write for 30 days
- Perfect for development
- You can update rules later

1. Select **"Start in test mode"**
2. Click **"Next"**

### Step 3.3: Choose Database Location

This is **IMPORTANT** - you cannot change it later!

**Choose the location closest to your users:**

**Americas:**

- `us-central1` (Iowa) - Good for US
- `us-east1` (South Carolina)
- `us-west1` (Oregon)
- `southamerica-east1` (São Paulo)

**Europe:**

- `europe-west1` (Belgium)
- `europe-west2` (London)
- `europe-west3` (Frankfurt)

**Asia:**

- `asia-south1` (Mumbai)
- `asia-southeast1` (Singapore)
- `asia-northeast1` (Tokyo)

**For India users:** Choose `asia-south1 (Mumbai)`
**For US users:** Choose `us-central1 (Iowa)`
**For Europe users:** Choose `europe-west1 (Belgium)`

1. Select your preferred location from dropdown
2. Click **"Enable"**
3. Wait 30-60 seconds for database creation

✅ **Firestore Database Created!**

**What you should see:**

- Empty database with "Start collection" button
- Your database ID will be: `(default)`
- Location will show your chosen region

**📝 Note your Database Details:**

```
Database ID: (default)
Location: [Your chosen location, e.g., asia-south1]
```

---

## Part 4: Enable Cloud Messaging (1 minute)

### Step 4.1: Navigate to Cloud Messaging

1. In the left sidebar, click **"Build"**
2. Click **"Cloud Messaging"**
3. You'll see the Cloud Messaging page

### Step 4.2: No Setup Required!

**Good news:** Cloud Messaging is automatically enabled for new projects!

You should see:

- Cloud Messaging API (Legacy) - Already enabled
- Instructions about Firebase Cloud Messaging

✅ **Cloud Messaging Ready!**

---

## Part 5: Enable Storage (1 minute)

### Step 5.1: Navigate to Storage

1. In the left sidebar, click **"Build"**
2. Click **"Storage"**
3. Click **"Get started"**

### Step 5.2: Security Rules

1. Select **"Start in test mode"**
2. Click **"Next"**

### Step 5.3: Storage Location

1. It will use the same location as your Firestore
2. Click **"Done"**

✅ **Storage Enabled!**

---

## Part 6: Get Firebase Configuration (2 minutes)

### Step 6.1: Register Web App

1. In the Firebase Console, go to **Project Overview** (click the home icon at top left)
2. Below the project name, click the **Web icon** `</>`
   - It looks like: `</>`
3. You'll see "Add Firebase to your web app"

### Step 6.2: Register Your App

1. **App nickname:** Enter `DoneWithIt Web` (or any name)
2. **Also set up Firebase Hosting:** Leave UNCHECKED ❌
3. Click **"Register app"**

### Step 6.3: Copy Your Config

You'll see a code snippet that looks like this:

```javascript
const firebaseConfig = {
	apiKey: "AIzaSyC...",
	authDomain: "donewithit-12345.firebaseapp.com",
	projectId: "donewithit-12345",
	storageBucket: "donewithit-12345.appspot.com",
	messagingSenderId: "123456789012",
	appId: "1:123456789012:web:abcdef123456",
	measurementId: "G-ABCDEFGH",
};
```

**COPY THIS ENTIRE OBJECT!** 📋

Click **"Continue to console"** when done.

---

## Part 7: Add Config to Your App (1 minute)

### Step 7.1: Update firebase.js

1. Open VS Code
2. Open file: `app/config/firebase.js`
3. Replace the placeholder values with your copied config:

**Before:**

```javascript
const firebaseConfig = {
	apiKey: "YOUR_API_KEY",
	authDomain: "YOUR_AUTH_DOMAIN",
	// ... etc
};
```

**After:**

```javascript
const firebaseConfig = {
	apiKey: "AIzaSyC...", // Your actual values
	authDomain: "donewithit-12345.firebaseapp.com",
	projectId: "donewithit-12345",
	storageBucket: "donewithit-12345.appspot.com",
	messagingSenderId: "123456789012",
	appId: "1:123456789012:web:abcdef123456",
	measurementId: "G-ABCDEFGH",
};
```

4. **Save the file**

✅ **Firebase Configuration Complete!**

---

## Part 8: Update Security Rules for Production

**⚠️ IMPORTANT:** After 30 days, test mode expires. Update rules before then!

### Firestore Rules (Secure)

1. Go to **Firestore Database** > **Rules** tab
2. Replace the rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users must be authenticated
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

3. Click **"Publish"**

### Storage Rules (Secure)

1. Go to **Storage** > **Rules** tab
2. Replace the rules with:

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

3. Click **"Publish"**

---

## Part 9: Test Your Setup

### Step 9.1: Verify Firestore

1. Go to **Firestore Database** > **Data** tab
2. You should see: "Start collection" button
3. This confirms database is ready

### Step 9.2: Verify Authentication

1. Go to **Authentication** > **Users** tab
2. You should see: "No users" message
3. This confirms auth is ready

### Step 9.3: Verify Your Config

1. Go to **Project Settings** (gear icon)
2. Scroll down to "Your apps"
3. You should see your web app listed
4. Click "Config" to view your configuration again if needed

---

## 🎉 Setup Complete! Summary

✅ **Firebase Project:** Created
✅ **Authentication:** Email/Password enabled
✅ **Firestore Database:** Created with location
✅ **Cloud Messaging:** Enabled
✅ **Storage:** Enabled
✅ **Configuration:** Copied to app

### Your Database Details:

```
Project ID: [Your project ID]
Database ID: (default)
Location: [Your chosen region]
```

---

## 🚨 Quick Troubleshooting

**Problem:** Can't find "Create database" button

- **Solution:** Make sure you clicked "Firestore Database" not "Realtime Database"

**Problem:** Database location is greyed out

- **Solution:** This is normal if you already created a database. Location cannot be changed.

**Problem:** Test mode expired message

- **Solution:** Update security rules as shown in Part 8

**Problem:** Config not working

- **Solution:** Make sure you copied the ENTIRE firebaseConfig object including all quotes and commas

---

## 📞 Next Steps

After completing this setup, proceed to migrate your app code:

1. **Update App.js** - Switch to FirebaseAuthProvider
2. **Update Screens** - Use useFirebaseAuth instead of useAuth
3. **Update APIs** - Use firebaseListings instead of listings

See the next guide: `FIREBASE_CODE_MIGRATION.md`

---

## 📝 Save These Details

Write down or save these important values:

```
✅ Project Name: ________________
✅ Project ID: ________________
✅ Database Location: ________________
✅ Web App Name: ________________
✅ Firebase Console URL: https://console.firebase.google.com/project/[YOUR_PROJECT_ID]
```

You can always access your Firebase Console at:
**https://console.firebase.google.com/**
