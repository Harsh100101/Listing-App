import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	useCallback,
} from "react";
import {
	loginWithFirebase,
	registerWithFirebase,
	logoutFromFirebase,
	getCurrentFirebaseUser,
	onAuthChanged,
} from "../services/firebaseAuth";
import {
	registerForPushNotifications,
	saveFCMTokenToFirestore,
} from "../services/firebaseMessaging";
import { devLog, devError } from "../utility/devLog";

// Create the Authentication Context
const FirebaseAuthContext = createContext({
	user: null,
	isAuthenticated: false,
	isLoading: true,
	login: async (email, password) => {},
	logout: async () => {},
	register: async (email, password, name) => {},
});

// Custom hook to use the Firebase auth context
export const useFirebaseAuth = () => {
	const context = useContext(FirebaseAuthContext);
	if (!context) {
		throw new Error(
			"useFirebaseAuth must be used within a FirebaseAuthProvider",
		);
	}
	return context;
};

// Firebase Authentication Provider Component
export const FirebaseAuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	// Listen to Firebase auth state changes
	useEffect(() => {
		devLog("🔄 Firebase Auth: Setting up auth listener...");

		const unsubscribe = onAuthChanged(async (firebaseUser) => {
			if (firebaseUser) {
				// User is signed in
				devLog("✅ Firebase Auth: User authenticated:", firebaseUser.email);

				// Register for push notifications
				const pushToken = await registerForPushNotifications();
				if (pushToken) {
					await saveFCMTokenToFirestore(firebaseUser.id, pushToken);
				}

				setUser({ ...firebaseUser, pushToken });
				setIsAuthenticated(true);
			} else {
				// User is signed out
				devLog("❌ Firebase Auth: No user authenticated");
				setUser(null);
				setIsAuthenticated(false);
			}
			setIsLoading(false);
		});

		// Cleanup subscription on unmount
		return () => unsubscribe();
	}, []);

	const login = useCallback(async (email, password) => {
		devLog("🔐 Firebase Auth Context: Starting login...");
		setIsLoading(true);

		try {
			const result = await loginWithFirebase(email, password);

			if (result.ok) {
				devLog("✅ Firebase Auth Context: Login successful");
				return {
					success: true,
					user: result.data.user,
					token: result.data.token,
				};
			} else {
				devLog("❌ Firebase Auth Context: Login failed:", result.error);
				return { success: false, error: result.error };
			}
		} catch (error) {
			devError("🚨 Firebase Auth Context: Login error:", error);
			return {
				success: false,
				error: error.message || "Login failed",
			};
		} finally {
			setIsLoading(false);
		}
	}, []);

	const logout = useCallback(async () => {
		devLog("👋 Firebase Auth Context: Starting logout...");
		setIsLoading(true);

		try {
			const result = await logoutFromFirebase();
			if (result.ok) {
				devLog("✅ Firebase Auth Context: Logout successful");
				return { success: true };
			} else {
				return { success: false, error: result.error };
			}
		} catch (error) {
			devError("🚨 Firebase Auth Context: Logout error:", error);
			return { success: false, error: error.message };
		} finally {
			setIsLoading(false);
		}
	}, []);

	const register = useCallback(async (email, password, name) => {
		devLog("📝 Firebase Auth Context: Starting registration...");
		setIsLoading(true);

		try {
			const result = await registerWithFirebase(email, password, name);

			if (result.ok) {
				devLog("✅ Firebase Auth Context: Registration successful");
				return { success: true, user: result.data.user };
			} else {
				devLog("❌ Firebase Auth Context: Registration failed:", result.error);
				return { success: false, error: result.error };
			}
		} catch (error) {
			devError("🚨 Firebase Auth Context: Registration error:", error);
			return {
				success: false,
				error: error.message || "Registration failed",
			};
		} finally {
			setIsLoading(false);
		}
	}, []);

	const value = {
		user,
		isAuthenticated,
		isLoading,
		login,
		logout,
		register,
	};

	return (
		<FirebaseAuthContext.Provider value={value}>
			{children}
		</FirebaseAuthContext.Provider>
	);
};

export default FirebaseAuthContext;
