// Quick test script to check if user extraction from auth token is working
// You can run this in your React Native app or test it in the console

import authApi from "./auth";

export const quickTokenTest = async () => {
	console.log("🧪 === QUICK TOKEN EXTRACTION TEST ===");

	// Step 1: Login to get a token
	console.log("1️⃣ Logging in...");
	const loginResult = await authApi.login("demo@example.com", "password123");

	if (!loginResult.ok) {
		console.log("❌ Login failed:", loginResult.error);
		return false;
	}

	console.log("✅ Login successful!");

	// Step 2: Check if token exists in storage
	console.log("2️⃣ Checking stored token...");
	const storedToken = await authApi.getToken();
	console.log("🔑 Token found:", storedToken ? "YES" : "NO");

	// Step 3: Extract user from token
	console.log("3️⃣ Extracting user from token...");
	const currentUser = await authApi.getCurrentUser();

	if (currentUser) {
		console.log("✅ USER EXTRACTION SUCCESSFUL!");
		console.log("👤 Extracted user data:", {
			id: currentUser.id,
			email: currentUser.email,
			name: currentUser.name,
			tokenIssuedAt: new Date(currentUser.iat).toLocaleString(),
			tokenExpiresAt: new Date(currentUser.exp).toLocaleString(),
		});

		// Step 4: Verify authentication status
		console.log("4️⃣ Checking authentication status...");
		const isAuth = await authApi.isAuthenticated();
		console.log("🔐 Is authenticated:", isAuth ? "YES" : "NO");

		return true;
	} else {
		console.log("❌ USER EXTRACTION FAILED!");
		console.log("🔍 Debugging info:");
		console.log("- Token exists:", !!storedToken);
		console.log("- Token format:", storedToken?.substring(0, 50) + "...");

		return false;
	}
};

// Test only the decoding function
export const testTokenDecoding = async () => {
	console.log("🔍 === TOKEN DECODING TEST ===");

	// Get the stored token
	const token = await authApi.getToken();

	if (!token) {
		console.log("❌ No token found. Please login first.");
		return false;
	}

	console.log("🔑 Token found:", token.substring(0, 50) + "...");

	// Try to decode it
	const decoded = authApi.decodeToken(token);

	if (decoded) {
		console.log("✅ Token decoded successfully:");
		console.log(decoded);
		return true;
	} else {
		console.log("❌ Token decoding failed");
		return false;
	}
};

// Export for easy testing
export default {
	quickTokenTest,
	testTokenDecoding,
};
