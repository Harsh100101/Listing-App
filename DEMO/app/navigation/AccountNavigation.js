import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AccountScreen from "../screen/AccountScreen";
import MessagesScreen from "../screen/MessagesScreen";
import MyListingsScreen from "../screen/MyListingsScreen";
import ChatScreen from "../screen/ChatScreen";

const Stack = createNativeStackNavigator();

const AccountNavigator = () => (
	<Stack.Navigator
		screenOptions={{
			presentation: "formSheet",
		}}
	>
		<Stack.Screen name="AccountDetails" component={AccountScreen} />
		<Stack.Screen name="Messages" component={MessagesScreen} />
		<Stack.Screen name="MyListings" component={MyListingsScreen} />
		<Stack.Screen
			name="Chat"
			component={ChatScreen}
			options={{
				presentation: "card",
				headerShown: true,
				headerTitle: "Chat",
			}}
		/>
	</Stack.Navigator>
);

export default AccountNavigator;
