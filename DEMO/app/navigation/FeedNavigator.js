import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ListingScreen from "../screen/ListingScreen";
import ListingDetailsScreen from "../screen/ListingDetailsScreen";
import ChatScreen from "../screen/ChatScreen";

const Stack = createNativeStackNavigator();

const FeedNavigator = () => (
	<Stack.Navigator
		screenOptions={{
			presentation: "formSheet",
			headerShown: false,
		}}
	>
		<Stack.Screen name="Listings" component={ListingScreen} />
		<Stack.Screen name="ListingDetails" component={ListingDetailsScreen} />
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

export default FeedNavigator;
