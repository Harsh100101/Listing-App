# 🔄 Firebase Code Migration Guide

## Step-by-Step Code Changes

After completing Firebase setup, follow these steps to migrate your app:

---

## STEP 1: Update App.js (Main Entry Point)

### File: `App.js`

**Find this code:**

```javascript
import { AuthProvider, useAuth } from "./app/auth";

export default function App() {
	return (
		<AuthProvider>
			<OfflineNotice />
			<GestureHandlerRootView style={{ flex: 1 }}>
				<RootNavigation />
			</GestureHandlerRootView>
		</AuthProvider>
	);
}
```

**Replace with:**

```javascript
import {
	FirebaseAuthProvider,
	useFirebaseAuth,
} from "./app/auth/firebaseContext";

export default function App() {
	return (
		<FirebaseAuthProvider>
			<OfflineNotice />
			<GestureHandlerRootView style={{ flex: 1 }}>
				<RootNavigation />
			</GestureHandlerRootView>
		</FirebaseAuthProvider>
	);
}
```

**Also update the RootNavigation component:**

**Find:**

```javascript
const RootNavigation = React.memo(() => {
	const { isAuthenticated } = useAuth();
	// ...
});
```

**Replace with:**

```javascript
const RootNavigation = React.memo(() => {
	const { isAuthenticated } = useFirebaseAuth();
	// ...
});
```

---

## STEP 2: Update LoginScreen.js

### File: `app/screen/LoginScreen.js`

**Find this import:**

```javascript
import { useAuth } from "../auth";
```

**Replace with:**

```javascript
import { useFirebaseAuth } from "../auth/firebaseContext";
```

**Find this line:**

```javascript
const { login, isLoading } = useAuth();
```

**Replace with:**

```javascript
const { login, isLoading } = useFirebaseAuth();
```

**No other changes needed!** The login function signature is the same.

---

## STEP 3: Update RegisterScreen.js

### File: `app/screen/RegisterScreen.js`

**Find this import:**

```javascript
import { useAuth } from "../auth/context";
```

**Replace with:**

```javascript
import { useFirebaseAuth } from "../auth/firebaseContext";
```

**Find this line:**

```javascript
const { register, login } = useAuth();
```

**Replace with:**

```javascript
const { register, login } = useFirebaseAuth();
```

**No other changes needed!**

---

## STEP 4: Update AccountScreen.js

### File: `app/screen/AccountScreen.js`

**Find this import:**

```javascript
import { useAuth } from "../auth";
```

**Replace with:**

```javascript
import { useFirebaseAuth } from "../auth/firebaseContext";
```

**Find this line:**

```javascript
const { user, logout } = useAuth();
```

**Replace with:**

```javascript
const { user, logout } = useFirebaseAuth();
```

**No other changes needed!**

---

## STEP 5: Update ListingScreen.js (Feed)

### File: `app/screen/ListingScreen.js`

**Find this import:**

```javascript
import listingApi from "../api/listings";
```

**Replace with:**

```javascript
import listingApi from "../api/firebaseListings";
```

**No other changes needed!** The API interface is identical.

---

## STEP 6: Update ListingEditScreen.js

### File: `app/screen/ListingEditScreen.js`

**Find these imports:**

```javascript
import listingsApi from "../api/listings";
import { useAuth } from "../auth";
```

**Replace with:**

```javascript
import listingsApi from "../api/firebaseListings";
import { useFirebaseAuth } from "../auth/firebaseContext";
```

**Find this line:**

```javascript
const { user } = useAuth();
```

**Replace with:**

```javascript
const { user } = useFirebaseAuth();
```

**No other changes needed!**

---

## STEP 7: Update MyListingsScreen.js

### File: `app/screen/MyListingsScreen.js`

**Find these imports:**

```javascript
import listingApi from "../api/listings";
import { useAuth } from "../auth/context";
```

**Replace with:**

```javascript
import listingApi from "../api/firebaseListings";
import { useFirebaseAuth } from "../auth/firebaseContext";
```

**Find this line:**

```javascript
const { user } = useAuth();
```

**Replace with:**

```javascript
const { user } = useFirebaseAuth();
```

**No other changes needed!**

---

## STEP 8: Update ListingDetailsScreen.js (Optional - for messaging)

### File: `app/screen/ListingDetailsScreen.js`

If you want to save messages to Firestore:

**Add this import at the top:**

```javascript
import { saveMessageToFirestore } from "../services/firebaseFirestore";
import { useFirebaseAuth } from "../auth/firebaseContext";
```

**Find the handleSendMessage function and update it:**

**Before:**

```javascript
const handleSendMessage = async () => {
	if (!message.trim()) return;

	await sendMessageNotification(
		listing.title,
		message,
		user?.name || "Someone",
	);

	setMessage("");
	Alert.alert("Success", "Your message has been sent");
};
```

**After:**

```javascript
const handleSendMessage = async () => {
	if (!message.trim()) return;

	const { user } = useFirebaseAuth();

	// Save to Firestore
	await saveMessageToFirestore({
		listingTitle: listing.title,
		message: message,
		senderId: user.id,
		senderName: user.name,
		recipientId: listing.userId,
		listingId: listing.id,
	});

	setMessage("");
	Alert.alert("Success", "Your message has been sent");
};
```

---

## 📋 Summary of Changes

### Files Modified (7 files):

1. ✅ `App.js` - Switch to FirebaseAuthProvider
2. ✅ `app/screen/LoginScreen.js` - Use useFirebaseAuth
3. ✅ `app/screen/RegisterScreen.js` - Use useFirebaseAuth
4. ✅ `app/screen/AccountScreen.js` - Use useFirebaseAuth
5. ✅ `app/screen/ListingScreen.js` - Use firebaseListings API
6. ✅ `app/screen/ListingEditScreen.js` - Use firebaseListings API & useFirebaseAuth
7. ✅ `app/screen/MyListingsScreen.js` - Use firebaseListings API & useFirebaseAuth

### Search & Replace Cheat Sheet:

Use VS Code's Find and Replace (Ctrl+Shift+H):

**Replace 1:**

- Find: `import { useAuth } from "../auth"`
- Replace: `import { useFirebaseAuth } from "../auth/firebaseContext"`

**Replace 2:**

- Find: `import { useAuth } from "../auth/context"`
- Replace: `import { useFirebaseAuth } from "../auth/firebaseContext"`

**Replace 3:**

- Find: `const { user, logout } = useAuth()`
- Replace: `const { user, logout } = useFirebaseAuth()`

**Replace 4:**

- Find: `const { user } = useAuth()`
- Replace: `const { user } = useFirebaseAuth()`

**Replace 5:**

- Find: `const { login, isLoading } = useAuth()`
- Replace: `const { login, isLoading } = useFirebaseAuth()`

**Replace 6:**

- Find: `const { register, login } = useAuth()`
- Replace: `const { register, login } = useFirebaseAuth()`

**Replace 7:**

- Find: `import listingApi from "../api/listings"`
- Replace: `import listingApi from "../api/firebaseListings"`

**Replace 8:**

- Find: `import listingsApi from "../api/listings"`
- Replace: `import listingsApi from "../api/firebaseListings"`

---

## 🧪 Testing After Migration

### Test 1: Registration

1. Restart the app
2. Go to Register screen
3. Create a new account with email/password
4. Should auto-login and navigate to main app

**Verify in Firebase Console:**

- Go to Authentication > Users
- You should see your new user listed

### Test 2: Login

1. Logout from the app
2. Login with the account you created
3. Should navigate to main app

### Test 3: Create Listing

1. Click "+" to create a new listing
2. Fill out the form
3. Submit the listing

**Verify in Firebase Console:**

- Go to Firestore Database > Data
- You should see a "listings" collection
- Your listing should appear there

### Test 4: View Listings

1. Go to Feed screen
2. Should see your listing
3. Click on it to view details

### Test 5: My Listings

1. Go to Account screen
2. Click "My Listings"
3. Should see only your listings

---

## 🔍 Troubleshooting

### Error: "Firebase: Error (auth/invalid-api-key)"

- **Fix:** Check `app/config/firebase.js` - make sure you pasted the correct config

### Error: "Missing or insufficient permissions"

- **Fix:** Go to Firestore > Rules, make sure you're in test mode or have proper rules set

### Users not appearing in Firebase Console

- **Fix:** Check Authentication is enabled with Email/Password provider

### Listings not saving to Firestore

- **Fix:**
  1. Check internet connection
  2. Verify Firestore is created
  3. Check browser console in Firestore tab for errors

### "Cannot read property 'id' of undefined"

- **Fix:** User object structure changed slightly. Check if you're accessing `user.id` instead of `user.uid`

### App crashes on startup

- **Fix:**
  1. Check all imports are correct
  2. Make sure FirebaseAuthProvider is wrapping the app
  3. Clear cache: `npx expo start -c`

---

## 🎯 Verification Checklist

Before testing, verify:

- [ ] Firebase config added to `app/config/firebase.js`
- [ ] Authentication enabled in Firebase Console
- [ ] Firestore database created in Firebase Console
- [ ] All imports updated (useAuth → useFirebaseAuth)
- [ ] All API imports updated (listings → firebaseListings)
- [ ] App.js uses FirebaseAuthProvider
- [ ] App restarted after changes

---

## 🚀 Next Steps After Migration

1. **Test thoroughly** - Create users, listings, messages
2. **Update security rules** - Move from test mode to production rules
3. **Add image upload** - Use Firebase Storage for listing images
4. **Enable offline mode** - Firestore has built-in offline support
5. **Add real-time updates** - Listen to Firestore changes live

---

## 📞 Need Help?

If you encounter issues:

1. Check the error message in app console
2. Check Firebase Console for any red error badges
3. Verify all services are enabled (Authentication, Firestore)
4. Try creating a test user directly in Firebase Console > Authentication > Add user
5. Check Firestore rules if you get permission errors

---

**Migration complete! Your app now uses Firebase for all backend operations! 🎉**
