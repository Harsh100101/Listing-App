import React, { useState } from "react";
import {
	View,
	StyleSheet,
	TextInput,
	Alert,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
} from "react-native";
import { Image } from "react-native-expo-image-cache";

import AppText from "../components/AppText";
import AppButton from "../components/AppButton";
import colors from "../config/colors";
import ListItem from "../components/lists/ListItem";
import { sendMessageNotification } from "../api/expoPushToken";
import { useFirebaseAuth } from "../auth/firebaseContext";
import { saveMessageToFirestore } from "../services/firebaseFirestore";
import routes from "../navigation/routes";

function ListingDetailsScreen({ route, navigation }) {
	const listing = route.params;
	const { user } = useFirebaseAuth();
	const [message, setMessage] = useState("");

	const handleSendMessage = async () => {
		if (!message.trim()) {
			Alert.alert("Empty Message", "Please enter a message to send.");
			return;
		}

		try {
			// Save message to Firestore
			const messageData = {
				listingId: listing.id,
				listingTitle: listing.title,
				listingImage: listing.images?.[0]?.url || listing.images?.[0] || "",
				message: message,
				senderId: user?.id || "anonymous",
				senderName: user?.name || "Guest",
				senderEmail: user?.email || "",
				recipientId: listing.userId,
				recipientName: listing.userName,
				recipientEmail: listing.userEmail,
			};

			const result = await saveMessageToFirestore(messageData);

			if (result.ok) {
				// Send notification to seller
				await sendMessageNotification(
					listing.title,
					message,
					user?.name || "Guest",
				);

				setMessage("");

				// Navigate to chat screen to continue conversation
				Alert.alert(
					"Message Sent!",
					"Your message has been sent. Would you like to continue the conversation?",
					[
						{
							text: "Later",
							style: "cancel",
						},
						{
							text: "Continue Chat",
							onPress: () => {
								navigation.navigate(routes.CHAT, {
									conversation: {
										listingId: listing.id,
										listingTitle: listing.title,
										listingImage:
											listing.images?.[0]?.url || listing.images?.[0] || "",
										senderId: user?.id || "anonymous",
										senderName: user?.name || "Guest",
										senderEmail: user?.email || "",
										recipientId: listing.userId,
										recipientName: listing.userName,
										recipientEmail: listing.userEmail,
									},
								});
							},
						},
					],
				);
			} else {
				Alert.alert("Error", "Failed to send message. Please try again.");
			}
		} catch (error) {
			console.error("Error sending message:", error);
			Alert.alert("Error", "Failed to send message. Please try again.");
		}
	};

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			style={{ flex: 1 }}
			keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
		>
			<ScrollView
				style={{ flex: 1 }}
				contentContainerStyle={{ paddingBottom: 100 }}
				keyboardShouldPersistTaps="handled"
			>
				<Image
					style={styles.image}
					preview={{
						uri: listing.images?.[0]?.thumbnailUrl || listing.images?.[0] || "",
					}}
					uri={listing.images?.[0]?.url || listing.images?.[0] || ""}
				/>
				<View style={styles.detailContainer}>
					<AppText style={styles.title}>{listing.title}</AppText>
					<AppText style={styles.price}>${listing.price}</AppText>
					<View style={styles.userContainer}>
						<ListItem
							title={listing.userName || "Unknown User"}
							subTitle={listing.userEmail || "No email"}
							image={require("../assets/images/person.jpg")}
						/>
					</View>
					<View style={styles.messageContainer}>
						<AppText style={styles.messageLabel}>Contact Seller</AppText>
						<TextInput
							style={styles.messageInput}
							placeholder="Type your message here..."
							placeholderTextColor={colors.medium}
							value={message}
							onChangeText={setMessage}
							multiline
							numberOfLines={4}
							textAlignVertical="top"
							autoCapitalize="sentences"
							returnKeyType="default"
						/>
						<AppButton title="Send Message" onPress={handleSendMessage} />
					</View>
				</View>
			</ScrollView>
		</KeyboardAvoidingView>
	);
}

export default ListingDetailsScreen;

const styles = StyleSheet.create({
	detailContainer: {
		padding: 20,
	},
	image: {
		width: "100%",
		height: 300,
	},
	title: {
		fontSize: 24,
		fontWeight: "500",
	},
	price: {
		color: colors.secondary,
		fontWeight: "bold",
		fontSize: 20,
		marginVertical: 10,
	},
	userContainer: {
		marginVertical: 50,
	},
	messageContainer: {
		marginTop: 20,
	},
	messageLabel: {
		fontSize: 18,
		fontWeight: "600",
		marginBottom: 10,
	},
	messageInput: {
		backgroundColor: colors.white,
		borderWidth: 1,
		borderColor: colors.light,
		borderRadius: 8,
		padding: 15,
		fontSize: 16,
		color: colors.dark,
		marginBottom: 15,
		minHeight: 100,
		maxHeight: 120,
		textAlignVertical: "top",
	},
});
