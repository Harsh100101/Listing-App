import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	useCallback,
} from "react";
import authApi from "../api/auth";
import { registerForPushNotificationsAsync } from "../api/expoPushToken";
import { devLog, devError } from "../utility/devLog";

// Create the Authentication Context
const AuthContext = createContext({
	// State
	user: null,
	isAuthenticated: false,
	isLoading: true,
	token: null,

	// Actions
	login: async (email, password) => {},
	logout: async () => {},
	register: async (email, password, name) => {},
	refreshUser: async () => {},
	checkAuthStatus: async () => {},
});

// Custom hook to use the auth context
export const useAuth = () => {
	const context = useContext(AuthContext);

	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}

	return context;
};

// Authentication Provider Component
export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [token, setToken] = useState(null);

	// Initialize authentication state when app starts
	useEffect(() => {
		initializeAuth();
	}, []);

	const initializeAuth = async () => {
		devLog("🔄 AuthContext: Initializing authentication...");
		setIsLoading(true);

		try {
			// Check if user is already authenticated
			const isUserAuthenticated = await authApi.isAuthenticated();
			devLog("🔐 AuthContext: User authenticated:", isUserAuthenticated);

			if (isUserAuthenticated) {
				// Get current user and token
				const currentUser = await authApi.getCurrentUser();
				const storedToken = await authApi.getToken();

				if (currentUser && storedToken) {
					devLog(
						"✅ AuthContext: User restored successfully:",
						currentUser.name,
					);
					setUser(currentUser);
					setToken(storedToken);
					setIsAuthenticated(true);
				} else {
					devLog("⚠️ AuthContext: Failed to restore user data");
					await clearAuthState();
				}
			} else {
				devLog("❌ AuthContext: No valid authentication found");
				await clearAuthState();
			}
		} catch (error) {
			devError("🚨 AuthContext: Error initializing auth:", error);
			await clearAuthState();
		} finally {
			setIsLoading(false);
			devLog("✅ AuthContext: Initialization complete");
		}
	};

	const clearAuthState = async () => {
		devLog("🧹 AuthContext: Clearing authentication state...");
		setUser(null);
		setToken(null);
		setIsAuthenticated(false);

		// Clear stored token
		try {
			await authApi.removeToken();
		} catch (error) {
			devError("Error clearing stored token:", error);
		}
	};

	const login = useCallback(async (email, password) => {
		devLog("🔐 AuthContext: Starting login process...");
		setIsLoading(true);

		try {
			devLog("🔐 AuthContext: Calling authApi.login...");
			const result = await authApi.login(email, password);

			if (result.ok) {
				devLog("✅ AuthContext: Login successful");
				const userData = result.data.user;
				const userToken = result.data.token;

				// Register for push notifications and get token
				const pushToken = await registerForPushNotificationsAsync();
				devLog("🔔 Push Notification Token:", pushToken);

				// Update context state
				setUser({ ...userData, pushToken });
				setToken(userToken);
				setIsAuthenticated(true);

				return {
					success: true,
					user: { ...userData, pushToken },
					token: userToken,
				};
			} else {
				devLog("❌ AuthContext: Login failed:", result.error);
				await clearAuthState();
				return { success: false, error: result.error };
			}
		} catch (error) {
			devError("🚨 AuthContext: Login error:", error);
			await clearAuthState();
			return {
				success: false,
				error: error.message || "Login failed",
			};
		} finally {
			setIsLoading(false);
		}
	}, []);

	const logout = useCallback(async () => {
		devLog("👋 AuthContext: Starting logout process...");
		setIsLoading(true);

		try {
			// Call API logout (clears stored token)
			await authApi.logout();
			devLog("✅ AuthContext: API logout successful");

			// Clear context state
			await clearAuthState();
			devLog("✅ AuthContext: Logout complete");

			return { success: true };
		} catch (error) {
			devError("🚨 AuthContext: Logout error:", error);
			// Still clear state even if API call fails
			await clearAuthState();
			return { success: false, error: error.message };
		} finally {
			setIsLoading(false);
		}
	}, []);

	const register = useCallback(async (email, password, name) => {
		devLog("📝 AuthContext: Starting registration process...");
		setIsLoading(true);

		try {
			const result = await authApi.register(email, password, name);

			if (result.ok) {
				devLog("✅ AuthContext: Registration successful");
				// After registration, we don't automatically log in
				// User needs to login separately
				return { success: true, user: result.data.user };
			} else {
				devLog("❌ AuthContext: Registration failed:", result.error);
				return { success: false, error: result.error };
			}
		} catch (error) {
			devError("🚨 AuthContext: Registration error:", error);
			return { success: false, error: error.message || "Registration failed" };
		} finally {
			setIsLoading(false);
		}
	}, []);

	const refreshUser = useCallback(async () => {
		devLog("🔄 AuthContext: Refreshing user data...");

		try {
			if (!isAuthenticated) {
				devLog("⚠️ AuthContext: Cannot refresh - user not authenticated");
				return { success: false, error: "Not authenticated" };
			}

			const currentUser = await authApi.getCurrentUser();

			if (currentUser) {
				setUser(currentUser);
				devLog("✅ AuthContext: User refreshed successfully");
				return { success: true, user: currentUser };
			} else {
				devLog("❌ AuthContext: Failed to refresh user - logging out");
				await logout();
				return { success: false, error: "Failed to refresh user" };
			}
		} catch (error) {
			devError("🚨 AuthContext: Error refreshing user:", error);
			return { success: false, error: error.message };
		}
	}, [isAuthenticated, logout]);

	const checkAuthStatus = useCallback(async () => {
		devLog("🔍 AuthContext: Checking authentication status...");

		try {
			const isValid = await authApi.isAuthenticated();

			if (!isValid && isAuthenticated) {
				devLog("⚠️ AuthContext: Authentication expired - logging out");
				await logout();
			}

			return isValid;
		} catch (error) {
			devError("🚨 AuthContext: Error checking auth status:", error);
			return false;
		}
	}, [isAuthenticated, logout]);

	// Context value object
	const value = {
		// State
		user,
		isAuthenticated,
		isLoading,
		token,

		// Actions
		login,
		logout,
		register,
		refreshUser,
		checkAuthStatus,

		// Utility methods
		clearAuthState,
		initializeAuth,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Export the context for advanced usage
export default AuthContext;
