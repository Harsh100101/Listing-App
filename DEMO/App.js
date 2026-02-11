import "./app/utility/disableWarnings";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import navigationTheme from "./app/navigation/navigationTheme";
import AppNavigator from "./app/navigation/AppNavigator";
import OfflineNotice from "app/components/OfflineNotice";
import AuthNavigator from "app/navigation/AuthNavigator";
import {
	FirebaseAuthProvider,
	useFirebaseAuth,
} from "./app/auth/firebaseContext";

const RootNavigation = React.memo(() => {
	const { isAuthenticated } = useFirebaseAuth();
	return (
		<NavigationContainer theme={navigationTheme}>
			{isAuthenticated ? <AppNavigator /> : <AuthNavigator />}
		</NavigationContainer>
	);
});

RootNavigation.displayName = "RootNavigation";

export default function App() {
	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<FirebaseAuthProvider>
				<OfflineNotice />
				<RootNavigation />
			</FirebaseAuthProvider>
		</GestureHandlerRootView>
	);
}
