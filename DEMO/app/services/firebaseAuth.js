import {
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
	signOut,
	onAuthStateChanged,
	updateProfile,
} from "firebase/auth";
import { auth } from "./firebase";
import { devLog, devError } from "../utility/devLog";

// Listen to auth state changes
export const onAuthChanged = (callback) => {
	return onAuthStateChanged(auth, (user) => {
		if (user) {
			devLog("🔐 Firebase Auth: User signed in:", user.email);
			callback({
				id: user.uid,
				email: user.email,
				name: user.displayName || user.email?.split("@")[0],
			});
		} else {
			devLog("🔐 Firebase Auth: User signed out");
			callback(null);
		}
	});
};

// Sign in with email and password
export const loginWithFirebase = async (email, password) => {
	try {
		devLog("🔐 Firebase Auth: Logging in...", email);
		const userCredential = await signInWithEmailAndPassword(
			auth,
			email,
			password,
		);
		const user = userCredential.user;

		devLog("✅ Firebase Auth: Login successful:", user.email);
		return {
			ok: true,
			data: {
				user: {
					id: user.uid,
					email: user.email,
					name: user.displayName || user.email?.split("@")[0],
				},
				token: await user.getIdToken(),
			},
		};
	} catch (error) {
		devError("❌ Firebase Auth: Login failed:", error.message);
		return {
			ok: false,
			error: getAuthErrorMessage(error.code),
		};
	}
};

// Register new user
export const registerWithFirebase = async (email, password, name) => {
	try {
		devLog("📝 Firebase Auth: Registering new user...", email);
		const userCredential = await createUserWithEmailAndPassword(
			auth,
			email,
			password,
		);
		const user = userCredential.user;

		// Update user profile with name
		await updateProfile(user, { displayName: name });

		devLog("✅ Firebase Auth: Registration successful:", user.email);
		return {
			ok: true,
			data: {
				user: {
					id: user.uid,
					email: user.email,
					name: name,
				},
			},
		};
	} catch (error) {
		devError("❌ Firebase Auth: Registration failed:", error.message);
		return {
			ok: false,
			error: getAuthErrorMessage(error.code),
		};
	}
};

// Sign out
export const logoutFromFirebase = async () => {
	try {
		devLog("👋 Firebase Auth: Logging out...");
		await signOut(auth);
		devLog("✅ Firebase Auth: Logout successful");
		return { ok: true };
	} catch (error) {
		devError("❌ Firebase Auth: Logout failed:", error.message);
		return {
			ok: false,
			error: error.message,
		};
	}
};

// Get current user
export const getCurrentFirebaseUser = () => {
	const user = auth.currentUser;
	if (user) {
		return {
			id: user.uid,
			email: user.email,
			name: user.displayName || user.email?.split("@")[0],
		};
	}
	return null;
};

// Helper to get user-friendly error messages
const getAuthErrorMessage = (errorCode) => {
	switch (errorCode) {
		case "auth/invalid-email":
			return "Invalid email address";
		case "auth/user-disabled":
			return "This account has been disabled";
		case "auth/user-not-found":
			return "No account found with this email";
		case "auth/wrong-password":
			return "Incorrect password";
		case "auth/email-already-in-use":
			return "Email already in use";
		case "auth/weak-password":
			return "Password should be at least 6 characters";
		case "auth/network-request-failed":
			return "Network error. Check your connection";
		case "auth/too-many-requests":
			return "Too many failed attempts. Try again later";
		case "auth/invalid-credential":
			return "Invalid email or password";
		default:
			return "Authentication failed. Please try again";
	}
};
