import React from "react";
import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	ActivityIndicator,
} from "react-native";
import { useAuth } from "../auth";
import AppText from "./AppText";

const AuthStatus = () => {
	const {
		user,
		isAuthenticated,
		isLoading,
		token,
		logout,
		refreshUser,
		checkAuthStatus,
	} = useAuth();

	if (isLoading) {
		return (
			<View style={styles.container}>
				<ActivityIndicator size="large" color="#007bff" />
				<AppText style={styles.loadingText}>Loading authentication...</AppText>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<AppText style={styles.title}>🔐 Authentication Status</AppText>

			<View style={styles.statusContainer}>
				<AppText style={styles.statusLabel}>Status:</AppText>
				<AppText
					style={[
						styles.statusValue,
						isAuthenticated ? styles.authenticated : styles.notAuthenticated,
					]}
				>
					{isAuthenticated ? "✅ Authenticated" : "❌ Not Authenticated"}
				</AppText>
			</View>

			{user ? (
				<View style={styles.userContainer}>
					<AppText style={styles.sectionTitle}>👤 User Information:</AppText>
					<AppText style={styles.userInfo}>ID: {user.id}</AppText>
					<AppText style={styles.userInfo}>Name: {user.name}</AppText>
					<AppText style={styles.userInfo}>Email: {user.email}</AppText>

					{user.iat && (
						<AppText style={styles.userInfo}>
							Login Time: {new Date(user.iat).toLocaleString()}
						</AppText>
					)}

					{user.exp && (
						<AppText style={styles.userInfo}>
							Token Expires: {new Date(user.exp).toLocaleString()}
						</AppText>
					)}
				</View>
			) : (
				<View style={styles.userContainer}>
					<AppText style={styles.noUser}>No user data available</AppText>
				</View>
			)}

			<View style={styles.tokenContainer}>
				<AppText style={styles.sectionTitle}>🔑 Token Information:</AppText>
				{token ? (
					<AppText style={styles.tokenText}>
						Token: {token.substring(0, 50)}...
					</AppText>
				) : (
					<AppText style={styles.noToken}>No token found</AppText>
				)}
			</View>

			<View style={styles.buttonContainer}>
				<TouchableOpacity style={styles.button} onPress={refreshUser}>
					<AppText style={styles.buttonText}>🔄 Refresh User</AppText>
				</TouchableOpacity>

				<TouchableOpacity style={styles.button} onPress={checkAuthStatus}>
					<AppText style={styles.buttonText}>🔍 Check Auth Status</AppText>
				</TouchableOpacity>

				{isAuthenticated && (
					<TouchableOpacity
						style={[styles.button, styles.logoutButton]}
						onPress={logout}
					>
						<AppText style={styles.buttonText}>👋 Logout</AppText>
					</TouchableOpacity>
				)}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 20,
		backgroundColor: "#f8f9fa",
	},
	title: {
		fontSize: 20,
		fontWeight: "bold",
		textAlign: "center",
		marginBottom: 20,
	},
	statusContainer: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 15,
		padding: 10,
		backgroundColor: "white",
		borderRadius: 8,
	},
	statusLabel: {
		fontSize: 16,
		fontWeight: "bold",
		marginRight: 10,
	},
	statusValue: {
		fontSize: 16,
		fontWeight: "bold",
	},
	authenticated: {
		color: "#28a745",
	},
	notAuthenticated: {
		color: "#dc3545",
	},
	userContainer: {
		backgroundColor: "white",
		padding: 15,
		borderRadius: 8,
		marginBottom: 15,
	},
	sectionTitle: {
		fontSize: 16,
		fontWeight: "bold",
		marginBottom: 10,
		color: "#333",
	},
	userInfo: {
		fontSize: 14,
		marginBottom: 5,
		color: "#666",
	},
	noUser: {
		fontSize: 14,
		color: "#999",
		fontStyle: "italic",
	},
	tokenContainer: {
		backgroundColor: "white",
		padding: 15,
		borderRadius: 8,
		marginBottom: 20,
	},
	tokenText: {
		fontSize: 12,
		fontFamily: "monospace",
		color: "#666",
		backgroundColor: "#f8f9fa",
		padding: 8,
		borderRadius: 4,
	},
	noToken: {
		fontSize: 14,
		color: "#999",
		fontStyle: "italic",
	},
	buttonContainer: {
		gap: 10,
	},
	button: {
		backgroundColor: "#007bff",
		padding: 15,
		borderRadius: 8,
		alignItems: "center",
	},
	logoutButton: {
		backgroundColor: "#dc3545",
	},
	buttonText: {
		color: "white",
		fontWeight: "bold",
		fontSize: 16,
	},
	loadingText: {
		textAlign: "center",
		marginTop: 10,
		color: "#666",
	},
});

export default AuthStatus;
