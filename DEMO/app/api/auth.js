import AsyncStorage from "@react-native-async-storage/async-storage";
import { Buffer } from "buffer";
import { devLog, devError } from "../utility/devLog";

// ⚠️ DEMO ONLY - Replace with real authentication in production
// These are demo accounts for development/testing purposes ONLY
// See DEMO_ACCOUNTS.md for current credentials
const mockUsers = [
	{
		id: 1,
		email: "demo@example.com",
		password: "demo-password-change-me", // Changed from weak password
		name: "Demo User",
	},
	{
		id: 2,
		email: "user@test.com",
		password: "test-password-change-me", // Changed from weak password
		name: "Test User",
	},
	{
		id: 3,
		email: "admin@admin.com",
		password: "admin-password-change-me", // Changed from weak password
		name: "Admin User",
	},
];

// Generate simple JWT-like token (Buffer polyfill for React Native)
const generateToken = (user) => {
	console.log("🔑 Generating token for user:", user.email);
	try {
		const header = Buffer.from(
			JSON.stringify({ alg: "HS256", typ: "JWT" }),
			"utf8",
		).toString("base64");
		const payload = Buffer.from(
			JSON.stringify({
				id: user.id,
				email: user.email,
				name: user.name,
				iat: Date.now(),
				exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
			}),
			"utf8",
		).toString("base64");
		const signature = Buffer.from(
			"mock-signature-" + Date.now(),
			"utf8",
		).toString("base64");
		const token = `${header}.${payload}.${signature}`;
		console.log(
			"✅ Token generated successfully",
			token.substring(0, 50) + "...",
		);
		return token;
	} catch (error) {
		console.error("🚨 Error generating token:", error);
		throw new Error(`Token generation failed: ${error.message}`);
	}
};

// Decode token to get user info (Buffer polyfill for React Native)
const decodeToken = (token) => {
	console.log(
		"🔍 Attempting to decode token:",
		token?.substring(0, 50) + "...",
	);
	try {
		if (!token) {
			console.log("❌ No token provided for decoding");
			return null;
		}

		const parts = token.split(".");
		console.log("🔧 Token parts count:", parts.length);

		if (parts.length !== 3) {
			console.log(
				"❌ Invalid token format - expected 3 parts, got:",
				parts.length,
			);
			return null;
		}

		console.log(
			"📦 Decoding payload from part 2:",
			parts[1].substring(0, 30) + "...",
		);
		const payload = JSON.parse(
			Buffer.from(parts[1], "base64").toString("utf8"),
		);
		console.log("✅ Successfully decoded payload:", payload);

		// Check if token is expired
		const now = Date.now();
		console.log("⏰ Token expiry check - Now:", now, "Expires:", payload.exp);

		if (now > payload.exp) {
			console.log("❌ Token has expired");
			return null;
		}

		console.log("✅ Token is valid and not expired");
		return payload;
	} catch (error) {
		console.error("🚨 Token decode error:", error);
		console.error("📝 Error details:", {
			message: error.message,
			name: error.name,
			stack: error.stack,
		});
		return null;
	}
};

// Store auth token
const storeToken = async (token) => {
	console.log("💾 Attempting to store token...");
	try {
		await AsyncStorage.setItem("authToken", token);
		console.log("✅ Token stored successfully");
		return true;
	} catch (error) {
		console.error("🚨 Error storing token:", error);
		console.error("📱 AsyncStorage error details:", {
			message: error.message,
			name: error.name,
			stack: error.stack,
		});
		return false;
	}
};

// Get stored auth token
const getToken = async () => {
	try {
		const token = await AsyncStorage.getItem("authToken");
		return token;
	} catch (error) {
		console.error("Error getting token:", error);
		return null;
	}
};

// Remove auth token (logout)
const removeToken = async () => {
	try {
		await AsyncStorage.removeItem("authToken");
		return true;
	} catch (error) {
		console.error("Error removing token:", error);
		return false;
	}
};

// Check if user is authenticated
const isAuthenticated = async () => {
	console.log("🔐 Checking if user is authenticated...");
	try {
		const token = await getToken();
		console.log(
			"🔑 Retrieved token:",
			token ? token.substring(0, 50) + "..." : "No token found",
		);

		if (!token) {
			console.log("❌ No token found - user not authenticated");
			return false;
		}

		const decoded = decodeToken(token);
		console.log(
			"📋 Decoded token result:",
			decoded ? "Valid user data" : "Invalid/expired token",
		);

		if (decoded) {
			console.log("✅ User is authenticated:", {
				id: decoded.id,
				email: decoded.email,
				name: decoded.name,
			});
		} else {
			console.log("❌ User is not authenticated - invalid token");
		}

		return decoded !== null;
	} catch (error) {
		console.error("🚨 Error checking authentication:", error);
		return false;
	}
};

// Get current user from token
const getCurrentUser = async () => {
	console.log("👤 Getting current user from stored token...");
	try {
		const token = await getToken();
		console.log("🔑 Token retrieved:", token ? "Found" : "Not found");

		if (!token) {
			console.log("❌ No token found - no current user");
			return null;
		}

		const decoded = decodeToken(token);

		if (decoded) {
			console.log("✅ Current user extracted successfully:", {
				id: decoded.id,
				email: decoded.email,
				name: decoded.name,
				iat: new Date(decoded.iat).toLocaleString(),
				exp: new Date(decoded.exp).toLocaleString(),
			});
		} else {
			console.log("❌ Failed to extract user from token");
		}

		return decoded;
	} catch (error) {
		console.error("🚨 Error getting current user:", error);
		console.error("📝 Error details:", {
			message: error.message,
			name: error.name,
			stack: error.stack,
		});
		return null;
	}
};

// Login function with offline authentication
const login = async (email, password) => {
	console.log("🔐 Login attempt started for:", email);

	try {
		// Input validation
		if (!email || !password) {
			console.log("❌ Login failed: Missing email or password");
			return {
				ok: false,
				error: "Email and password are required",
			};
		}

		console.log("📧 Searching for user:", email);
		console.log(
			"👥 Available users:",
			mockUsers.map((u) => u.email),
		);

		// Simulate network delay
		await new Promise((resolve) => setTimeout(resolve, 500));

		// Find user in mock database
		const user = mockUsers.find(
			(u) =>
				u.email.toLowerCase().trim() === email.toLowerCase().trim() &&
				u.password === password,
		);

		if (!user) {
			console.log("❌ Login failed: Invalid credentials for", email);
			console.log("🔍 Tried to match:", {
				email: email.toLowerCase().trim(),
				password: password,
				availableEmails: mockUsers.map((u) => u.email.toLowerCase()),
			});
			return {
				ok: false,
				error: `Invalid email or password. Available users: ${mockUsers.map((u) => u.email).join(", ")}`,
			};
		}

		console.log("✅ User found:", {
			id: user.id,
			email: user.email,
			name: user.name,
		});

		// Generate token
		console.log("🔑 Generating token...");
		const token = generateToken(user);
		console.log("✅ Token generated:", token.substring(0, 50) + "...");

		// Store token
		console.log("💾 Storing token...");
		const stored = await storeToken(token);

		if (!stored) {
			console.log("❌ Failed to store token");
			return {
				ok: false,
				error: "Failed to store authentication token",
			};
		}

		console.log("🎉 Login successful for user:", user.email);
		console.log("📱 Token stored successfully");

		return {
			ok: true,
			data: {
				token,
				user: {
					id: user.id,
					email: user.email,
					name: user.name,
				},
			},
		};
	} catch (error) {
		console.error("🚨 CRITICAL LOGIN ERROR:", error);
		console.error("📍 Error stack:", error.stack);
		console.error("📝 Error details:", {
			message: error.message,
			name: error.name,
			email: email,
			passwordLength: password?.length || 0,
		});

		return {
			ok: false,
			error: `Login error: ${error.message || "Unknown error"}. Please check console for details.`,
		};
	}
};

// Register new user (offline)
const register = async (email, password, name) => {
	try {
		// Check if user already exists
		const existingUser = mockUsers.find(
			(u) => u.email.toLowerCase() === email.toLowerCase(),
		);

		if (existingUser) {
			return {
				ok: false,
				error: "User with this email already exists",
			};
		}

		// Create new user
		const newUser = {
			id: mockUsers.length + 1,
			email,
			password,
			name: name || "New User",
		};

		// Add to mock database
		mockUsers.push(newUser);

		console.log("User registered successfully:", newUser.email);

		return {
			ok: true,
			data: {
				user: {
					id: newUser.id,
					email: newUser.email,
					name: newUser.name,
				},
			},
		};
	} catch (error) {
		console.error("Registration error:", error);
		return {
			ok: false,
			error: "An error occurred during registration",
		};
	}
};

// Logout function
const logout = async () => {
	try {
		await removeToken();
		console.log("Logged out successfully");
		return { ok: true };
	} catch (error) {
		console.error("Logout error:", error);
		return { ok: false, error: "Failed to logout" };
	}
};

// Test function to verify token creation and extraction
const testTokenExtraction = async () => {
	console.log("🧪 === TOKEN EXTRACTION TEST STARTED ===");

	try {
		// 1. Test user login and token creation
		console.log("📝 Step 1: Testing login and token creation");
		const loginResult = await login("demo@example.com", "password123");

		if (!loginResult.ok) {
			console.log("❌ Login failed, cannot test token extraction");
			return { success: false, error: "Login failed" };
		}

		console.log("✅ Login successful, token created");

		// 2. Test token retrieval
		console.log("📝 Step 2: Testing token retrieval from storage");
		const storedToken = await getToken();
		console.log("🔑 Stored token:", storedToken?.substring(0, 50) + "...");

		// 3. Test token decoding
		console.log("📝 Step 3: Testing token decoding");
		const decodedUser = decodeToken(storedToken);
		console.log("👤 Decoded user:", decodedUser);

		// 4. Test getCurrentUser function
		console.log("📝 Step 4: Testing getCurrentUser function");
		const currentUser = await getCurrentUser();
		console.log("👤 Current user from function:", currentUser);

		// 5. Test isAuthenticated function
		console.log("📝 Step 5: Testing isAuthenticated function");
		const isAuth = await isAuthenticated();
		console.log("🔒 Is authenticated:", isAuth);

		console.log("🧪 === TOKEN EXTRACTION TEST COMPLETED ===");

		return {
			success: true,
			results: {
				loginSuccessful: loginResult.ok,
				tokenStored: !!storedToken,
				tokenDecoded: !!decodedUser,
				currentUserRetrieved: !!currentUser,
				isAuthenticated: isAuth,
				userDetails: currentUser,
			},
		};
	} catch (error) {
		console.error("🚨 Token extraction test error:", error);
		return { success: false, error: error.message };
	}
};

export default {
	login,
	register,
	logout,
	getToken,
	removeToken,
	isAuthenticated,
	getCurrentUser,
	decodeToken, // Export for testing
	testTokenExtraction, // Export test function
	mockUsers, // For testing purposes
};
