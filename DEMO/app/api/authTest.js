// Test file to demonstrate offline authentication
// You can run this in the console or import it to test auth functionality

import authApi from "./auth";

// Test function to demonstrate authentication flow
export const testAuthentication = async () => {
	console.log("=== Testing Offline Authentication ===");

	// Test 1: Login with valid credentials
	console.log("\n1. Testing login with valid credentials...");
	const loginResult = await authApi.login("demo@example.com", "password123");
	console.log("Login result:", loginResult);

	if (loginResult.ok) {
		console.log("✅ Login successful!");
		console.log("Token:", loginResult.data.token);
		console.log("User:", loginResult.data.user);

		// Test 2: Check if authenticated
		console.log("\n2. Checking authentication status...");
		const isAuth = await authApi.isAuthenticated();
		console.log("Is authenticated:", isAuth);

		// Test 3: Get current user
		console.log("\n3. Getting current user...");
		const currentUser = await authApi.getCurrentUser();
		console.log("Current user:", currentUser);

		// Test 4: Get stored token
		console.log("\n4. Getting stored token...");
		const storedToken = await authApi.getToken();
		console.log("Stored token:", storedToken?.substring(0, 50) + "...");
	}

	// Test 5: Login with invalid credentials
	console.log("\n5. Testing login with invalid credentials...");
	const invalidLogin = await authApi.login("invalid@email.com", "wrongpass");
	console.log("Invalid login result:", invalidLogin);

	// Test 6: Register new user
	console.log("\n6. Testing user registration...");
	const registerResult = await authApi.register(
		"newuser@test.com",
		"newpass123",
		"New User",
	);
	console.log("Registration result:", registerResult);

	// Test 7: Show all mock users
	console.log("\n7. All available mock users:");
	authApi.mockUsers.forEach((user) => {
		console.log(
			`- Email: ${user.email}, Password: ${user.password}, Name: ${user.name}`,
		);
	});

	console.log("\n=== Authentication Test Complete ===");
};

// Available test credentials
export const testCredentials = {
	user1: { email: "demo@example.com", password: "password123" },
	user2: { email: "user@test.com", password: "test123" },
	user3: { email: "admin@admin.com", password: "admin123" },
};

// Quick login test function
export const quickLogin = async (
	email = "demo@example.com",
	password = "password123",
) => {
	console.log(`Attempting login with ${email}...`);
	const result = await authApi.login(email, password);

	if (result.ok) {
		console.log("✅ Login successful!");
		console.log("Token:", result.data.token.substring(0, 50) + "...");
		console.log("User:", result.data.user.name);
		return result.data.token;
	} else {
		console.log("❌ Login failed:", result.error);
		return null;
	}
};

// Quick logout test function
export const quickLogout = async () => {
	console.log("Logging out...");
	const result = await authApi.logout();

	if (result.ok) {
		console.log("✅ Logout successful!");
	} else {
		console.log("❌ Logout failed:", result.error);
	}
};

export default {
	testAuthentication,
	testCredentials,
	quickLogin,
	quickLogout,
};
