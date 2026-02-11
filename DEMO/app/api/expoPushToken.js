import AsyncStorage from "@react-native-async-storage/async-storage";

// Simplified version without expo-notifications (works in Expo Go)
export const registerForPushNotificationsAsync = async () => {
	// Generate a mock token for offline use
	const mockToken = `ExponentPushToken[mock-${Date.now()}]`;
	await AsyncStorage.setItem("expoPushToken", mockToken);
	console.log("📱 Mock push token generated:", mockToken);
	return mockToken;
};

export const getStoredPushToken = async () => {
	return await AsyncStorage.getItem("expoPushToken");
};

// Store messages locally (simplified for Expo Go)
export const sendMessageNotification = async (
	listingTitle,
	message,
	userName,
) => {
	try {
		// Store message in local storage
		const messageData = {
			id: Date.now().toString(),
			listingTitle,
			message,
			userName,
			timestamp: new Date().toISOString(),
		};

		// Get existing messages
		const existingMessages = await AsyncStorage.getItem("userMessages");
		const messages = existingMessages ? JSON.parse(existingMessages) : [];

		// Add new message
		messages.push(messageData);
		await AsyncStorage.setItem("userMessages", JSON.stringify(messages));

		console.log("📨 Message stored:", messageData);
		return messageData.id;
	} catch (error) {
		console.error("Error storing message:", error);
		return null;
	}
};

// Get all messages (for displaying in a messages screen)
export const getStoredMessages = async () => {
	try {
		const messages = await AsyncStorage.getItem("userMessages");
		return messages ? JSON.parse(messages) : [];
	} catch (error) {
		console.error("Error getting messages:", error);
		return [];
	}
};
