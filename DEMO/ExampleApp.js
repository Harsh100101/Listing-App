// Example App.js integration with Authentication Context
// Place this code in your main App.js file

import React from "react";
import { View, StyleSheet } from "react-native";
import { AuthProvider, useAuth } from "./app/auth";
import LoginScreen from "./app/screen/LoginScreen";
import AuthStatus from "./app/components/AuthStatus";
import Screen from "./app/components/Screen";

// Main App Component that uses authentication
const MainApp = () => {
	const { user, isAuthenticated, isLoading } = useAuth();

	if (isLoading) {
		return (
			<Screen style={styles.container}>
				<AuthStatus />
			</Screen>
		);
	}

	return (
		<Screen style={styles.container}>
			{isAuthenticated ? (
				// User is logged in - show main app content
				<AuthStatus />
			) : (
				// User is not logged in - show login screen
				<LoginScreen />
			)}
		</Screen>
	);
};

// Root App Component with AuthProvider
const App = () => {
	return (
		<AuthProvider>
			<MainApp />
		</AuthProvider>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f8f9fa",
	},
});

export default App;

/* 
=== USAGE INSTRUCTIONS ===

1. Wrap your entire app with AuthProvider:
   ```jsx
   <AuthProvider>
     <YourAppContent />
   </AuthProvider>
   ```

2. Use the useAuth hook in any component:
   ```jsx
   import { useAuth } from './app/auth';
   
   const MyComponent = () => {
     const { user, isAuthenticated, login, logout } = useAuth();
     
     // Your component logic here
   };
   ```

3. Available context methods and properties:
   
   STATE:
   - user: Current user object or null
   - isAuthenticated: Boolean authentication status
   - isLoading: Boolean loading state
   - token: Current auth token or null
   
   ACTIONS:
   - login(email, password): Login user
   - logout(): Logout current user
   - register(email, password, name): Register new user
   - refreshUser(): Refresh current user data
   - checkAuthStatus(): Verify authentication status

4. The context automatically:
   - Restores authentication state on app start
   - Manages token storage and retrieval
   - Provides loading states during operations
   - Handles errors gracefully
   - Logs all operations for debugging

5. Example usage in screens:
   ```jsx
   const { user, logout } = useAuth();
   
   return (
     <View>
       <Text>Welcome {user?.name}</Text>
       <Button onPress={logout} title="Logout" />
     </View>
   );
   ```
*/
