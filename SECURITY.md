# 🔒 Security Setup Guide

## ⚠️ CRITICAL: Firebase Configuration Security

### 🚨 Immediate Action Required

If you've already pushed your code with exposed API keys:

1. **Regenerate Firebase Keys Immediately:**
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Select your project (`fir-fbfae`)
   - Go to Project Settings → General
   - Delete the current web app and create a new one with new keys
   - This invalidates the old exposed keys

2. **Update Security Rules:**
   - Go to Firestore Database → Rules
   - Go to Storage → Rules
   - Ensure your rules are restrictive and not open to public access

### 🔧 Proper Environment Setup

1. **Create Environment File:**

   ```bash
   cd DEMO
   cp .env.example .env
   ```

2. **Add Your Real Firebase Keys to .env:**

   ```env
   EXPO_PUBLIC_FIREBASE_API_KEY=your-real-api-key
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   # ... etc
   ```

3. **Verify .env is in .gitignore:**
   - The .env file should NEVER be committed to git
   - It's already excluded in the .gitignore

### 🛡️ Security Best Practices

1. **Firebase Security Rules:**

   ```javascript
   // Firestore Rules Example
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Only authenticated users can read/write their own data
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
       // Listings can be read by anyone, but only created/updated by authenticated users
       match /listings/{listingId} {
         allow read: if true;
         allow create, update, delete: if request.auth != null;
       }
     }
   }
   ```

2. **Environment Variables:**
   - Use `EXPO_PUBLIC_` prefix for client-side variables in Expo
   - Never commit .env files
   - Use different Firebase projects for development/production

3. **API Key Restrictions:**
   - In Firebase Console → Credentials
   - Restrict API keys to specific domains/apps
   - Enable only necessary services

### 🔄 If Keys Were Already Exposed

1. **Immediately revoke and regenerate all Firebase keys**
2. **Check Firebase Auth users for any unauthorized access**
3. **Review Firestore and Storage for any malicious data**
4. **Update security rules to be more restrictive**
5. **Monitor project usage for unusual activity**

### 📱 Team Development

For team development, share environment variables securely:

1. **Use a password manager or secure document sharing**
2. **Consider using different Firebase projects per developer**
3. **Use environment variable management tools like:**
   - Doppler
   - AWS Secrets Manager
   - Azure Key Vault

Remember: **Security is not optional!** 🔒
