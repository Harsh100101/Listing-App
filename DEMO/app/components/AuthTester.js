import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import authApi from "../api/auth";

const AuthTester = () => {
	const [result, setResult] = useState("");
	const [loading, setLoading] = useState(false);
	const testTokenExtraction = async () => {
		setLoading(true);
		setResult("Testing token extraction...");

		try {
			console.log("🧪 AuthTester: Starting token extraction test");
			const testResult = await authApi.testTokenExtraction();

			if (testResult.success) {
				const results = testResult.results;
				setResult(`🧪 TOKEN EXTRACTION TEST RESULTS:
        
✅ Login: ${results.loginSuccessful ? "SUCCESS" : "FAILED"}
✅ Token Stored: ${results.tokenStored ? "SUCCESS" : "FAILED"}  
✅ Token Decoded: ${results.tokenDecoded ? "SUCCESS" : "FAILED"}
✅ Current User Retrieved: ${results.currentUserRetrieved ? "SUCCESS" : "FAILED"}
✅ Is Authenticated: ${results.isAuthenticated ? "SUCCESS" : "FAILED"}

👤 User Details:
${results.userDetails ? JSON.stringify(results.userDetails, null, 2) : "No user details found"}

📝 Check console for detailed logs!`);
			} else {
				setResult(`❌ Token extraction test failed: ${testResult.error}`);
			}
		} catch (error) {
			console.error("🧪 AuthTester: Token extraction test error:", error);
			setResult(`🚨 Token extraction test exception: ${error.message}`);
		} finally {
			setLoading(false);
		}
	};
	const testLogin = async (email, password) => {
		setLoading(true);
		setResult("Testing login...");

		try {
			console.log("🧪 AuthTester: Starting test login");
			const loginResult = await authApi.login(email, password);

			console.log("🧪 AuthTester: Login result:", loginResult);

			if (loginResult.ok) {
				setResult(
					`✅ SUCCESS!\nUser: ${loginResult.data.user.name}\nEmail: ${loginResult.data.user.email}\nToken: ${loginResult.data.token.substring(0, 50)}...`,
				);
			} else {
				setResult(`❌ FAILED!\nError: ${loginResult.error}`);
			}
		} catch (error) {
			console.error("🧪 AuthTester: Test error:", error);
			setResult(
				`🚨 EXCEPTION!\nError: ${error.message}\nStack: ${error.stack}`,
			);
		} finally {
			setLoading(false);
		}
	};

	const testAuthStatus = async () => {
		setLoading(true);
		try {
			const isAuth = await authApi.isAuthenticated();
			const currentUser = await authApi.getCurrentUser();
			const token = await authApi.getToken();

			setResult(
				`Auth Status: ${isAuth ? "✅ Authenticated" : "❌ Not authenticated"}\nCurrent User: ${currentUser ? currentUser.name : "None"}\nToken: ${token ? token.substring(0, 50) + "..." : "None"}`,
			);
		} catch (error) {
			setResult(`Error checking auth: ${error.message}`);
		} finally {
			setLoading(false);
		}
	};

	const clearAuth = async () => {
		setLoading(true);
		try {
			await authApi.logout();
			setResult("✅ Authentication cleared!");
		} catch (error) {
			setResult(`Error clearing auth: ${error.message}`);
		} finally {
			setLoading(false);
		}
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>🧪 Auth System Tester</Text>

			<View style={styles.buttonContainer}>
				<TouchableOpacity
					style={[styles.button, { backgroundColor: "#28a745" }]}
					onPress={testTokenExtraction}
					disabled={loading}
				>
					<Text style={styles.buttonText}>🧪 Test Token Extraction</Text>
				</TouchableOpacity>

				<TouchableOpacity
					style={styles.button}
					onPress={() => testLogin("demo@example.com", "password123")}
					disabled={loading}
				>
					<Text style={styles.buttonText}>Test Demo Login</Text>
				</TouchableOpacity>

				<TouchableOpacity
					style={styles.button}
					onPress={() => testLogin("admin@admin.com", "admin123")}
					disabled={loading}
				>
					<Text style={styles.buttonText}>Test Admin Login</Text>
				</TouchableOpacity>

				<TouchableOpacity
					style={styles.button}
					onPress={() => testLogin("user@test.com", "test123")}
					disabled={loading}
				>
					<Text style={styles.buttonText}>Test User Login</Text>
				</TouchableOpacity>

				<TouchableOpacity
					style={styles.button}
					onPress={() => testLogin("wrong@email.com", "wrongpass")}
					disabled={loading}
				>
					<Text style={styles.buttonText}>Test Invalid Login</Text>
				</TouchableOpacity>

				<TouchableOpacity
					style={styles.button}
					onPress={testAuthStatus}
					disabled={loading}
				>
					<Text style={styles.buttonText}>Check Auth Status</Text>
				</TouchableOpacity>

				<TouchableOpacity
					style={styles.button}
					onPress={clearAuth}
					disabled={loading}
				>
					<Text style={styles.buttonText}>Clear Auth</Text>
				</TouchableOpacity>
			</View>

			<View style={styles.resultContainer}>
				<Text style={styles.resultTitle}>Result:</Text>
				<Text style={styles.result}>{loading ? "Loading..." : result}</Text>
			</View>

			<Text style={styles.note}>
				📝 Check the console for detailed logs during testing
			</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		backgroundColor: "#f5f5f5",
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		textAlign: "center",
		marginBottom: 20,
	},
	buttonContainer: {
		marginBottom: 20,
	},
	button: {
		backgroundColor: "#007bff",
		padding: 15,
		marginVertical: 5,
		borderRadius: 8,
	},
	buttonText: {
		color: "white",
		textAlign: "center",
		fontWeight: "bold",
	},
	resultContainer: {
		backgroundColor: "white",
		padding: 15,
		borderRadius: 8,
		marginBottom: 20,
	},
	resultTitle: {
		fontSize: 16,
		fontWeight: "bold",
		marginBottom: 10,
	},
	result: {
		fontSize: 14,
		fontFamily: "monospace",
	},
	note: {
		fontSize: 12,
		color: "#666",
		textAlign: "center",
		fontStyle: "italic",
	},
});

export default AuthTester;
