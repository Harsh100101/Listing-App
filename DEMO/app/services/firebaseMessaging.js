import { Platform } from "react-native";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { devLog, devError } from "../utility/devLog";

// Check if we're in Expo Go (which doesn't support push notifications in SDK 53+)
const isExpoGo = Constants.appOwnership === "expo";

// Register for push notifications and get FCM token
export const registerForPushNotifications = async () => {
	try {
		// Skip push notifications in Expo Go to avoid errors
		if (isExpoGo) {
			devLog(
				"⚠️ Push notifications not supported in Expo Go (SDK 53+). Using mock token.",
			);
			const mockToken = `ExponentPushToken[mock-${Date.now()}]`;
			return mockToken;
		}

		if (!Device.isDevice) {
			devLog("⚠️ Push notifications only work on physical devices");
			return null;
		}

		// Dynamically import expo-notifications only when not in Expo Go
		const Notifications = await import("expo-notifications");

		// Configure notification handler
		Notifications.default.setNotificationHandler({
			handleNotification: async () => ({
				shouldShowAlert: true,
				shouldPlaySound: true,
				shouldSetBadge: true,
			}),
		});

		const { status: existingStatus } =
			await Notifications.default.getPermissionsAsync();
		let finalStatus = existingStatus;

		if (existingStatus !== "granted") {
			const { status } = await Notifications.default.requestPermissionsAsync();
			finalStatus = status;
		}

		if (finalStatus !== "granted") {
			devLog("❌ Push notification permission denied");
			return null;
		}

		// Get the Expo Push Token (works with Firebase)
		try {
			const tokenData = await Notifications.default.getExpoPushTokenAsync();
			const token = tokenData.data;
			devLog("✅ FCM Token obtained:", token);

			// Configure Android notification channel
			if (Platform.OS === "android") {
				await Notifications.default.setNotificationChannelAsync("default", {
					name: "default",
					importance: Notifications.default.AndroidImportance.MAX,
					vibrationPattern: [0, 250, 250, 250],
					lightColor: "#FF231F7C",
				});
			}

			return token;
		} catch (tokenError) {
			devLog(
				"⚠️ Could not get Expo Push Token (use development build for full support):",
				tokenError.message,
			);
			// Generate a mock token for development
			const mockToken = `ExponentPushToken[mock-${Date.now()}]`;
			devLog("📱 Mock push token generated:", mockToken);
			return mockToken;
		}
	} catch (error) {
		devError("❌ Error getting push token:", error);
		return null;
	}
};

// Send a notification (for testing)
export const sendLocalNotification = async (title, message) => {
	try {
		if (isExpoGo) {
			devLog("⚠️ Local notifications not supported in Expo Go");
			return;
		}

		const Notifications = await import("expo-notifications");
		await Notifications.default.scheduleNotificationAsync({
			content: {
				title,
				body: message,
				data: { timestamp: Date.now() },
			},
			trigger: null, // Send immediately
		});
		devLog("✅ Local notification sent");
	} catch (error) {
		devError("❌ Error sending notification:", error);
	}
};

// Listen to notification responses (when user taps notification)
export const addNotificationResponseListener = async (callback) => {
	try {
		if (isExpoGo) {
			devLog("⚠️ Notification listeners not supported in Expo Go");
			return () => {}; // Return empty cleanup function
		}

		const Notifications = await import("expo-notifications");
		return Notifications.default.addNotificationResponseReceivedListener(
			callback,
		);
	} catch (error) {
		devError("❌ Error adding notification response listener:", error);
		return () => {};
	}
};

// Listen to incoming notifications (when app is in foreground)
export const addNotificationReceivedListener = async (callback) => {
	try {
		if (isExpoGo) {
			devLog("⚠️ Notification listeners not supported in Expo Go");
			return () => {}; // Return empty cleanup function
		}

		const Notifications = await import("expo-notifications");
		return Notifications.default.addNotificationReceivedListener(callback);
	} catch (error) {
		devError("❌ Error adding notification received listener:", error);
		return () => {};
	}
};

// Save FCM token to Firestore (to send notifications to specific users)
export const saveFCMTokenToFirestore = async (userId, token) => {
	try {
		// Import Firestore functions
		const { doc, setDoc } = await import("firebase/firestore");
		const { db } = await import("./firebase");

		await setDoc(
			doc(db, "users", userId),
			{
				fcmToken: token,
				lastTokenUpdate: new Date(),
			},
			{ merge: true },
		);

		devLog("✅ FCM token saved to Firestore for user:", userId);
		return { ok: true };
	} catch (error) {
		devError("❌ Error saving FCM token:", error);
		return { ok: false, error: error.message };
	}
};
