import React, { useState, useEffect } from "react";
import { FlatList, StyleSheet, View, Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import ListItem from "../components/lists/ListItem";
import Screen from "../components/Screen";
import ListItemSeparator from "../components/lists/ListItemSeparator";
import ListItemDeleteAction from "../components/lists/ListItemDeleteAction";
import ActivityIndicator from "../components/ActivityIndicator";
import AppText from "../components/AppText";
import { useFirebaseAuth } from "../auth/firebaseContext";
import {
	getUserMessagesFromFirestore,
	deleteMessageFromFirestore,
} from "../services/firebaseFirestore";
import routes from "../navigation/routes";

function MessagesScreen({ navigation }) {
	const { user } = useFirebaseAuth();
	const [messages, setMessages] = useState([]);
	const [refreshing, setRefreshing] = useState(false);
	const [loading, setLoading] = useState(true);

	const loadMessages = async () => {
		if (!user?.id) return;

		setLoading(true);
		const result = await getUserMessagesFromFirestore(user.id);
		if (result.ok) {
			setMessages(result.data);
		}
		setLoading(false);
	};

	useEffect(() => {
		loadMessages();
	}, [user]);

	// Refresh messages when screen comes into focus
	useFocusEffect(
		React.useCallback(() => {
			loadMessages();
		}, [user]),
	);

	const handleDelete = async (message) => {
		// Delete message from Firestore
		const result = await deleteMessageFromFirestore(message.id);
		if (result.ok) {
			// Remove from local state
			setMessages(messages.filter((m) => m.id !== message.id));
		} else {
			Alert.alert("Error", "Failed to delete message. Please try again.");
		}
	};

	const handleRefresh = async () => {
		setRefreshing(true);
		await loadMessages();
		setRefreshing(false);
	};

	const handleMessagePress = async (message) => {
		// Navigate to chat screen to view full conversation
		if (!message.listingId) {
			Alert.alert("Error", "Unable to find the conversation for this message.");
			return;
		}

		// Navigate to Chat screen with conversation data
		navigation.navigate(routes.CHAT, {
			conversation: {
				listingId: message.listingId,
				listingTitle: message.listingTitle,
				listingImage: message.listingImage,
				senderId: message.senderId,
				senderName: message.senderName,
				senderEmail: message.senderEmail,
				recipientId: message.recipientId,
				recipientName: message.recipientName,
				recipientEmail: message.recipientEmail,
			},
		});
	};

	return (
		<Screen>
			<ActivityIndicator visible={loading && !refreshing} />
			{!loading && messages.length === 0 && (
				<View style={styles.emptyContainer}>
					<AppText style={styles.emptyText}>
						No messages yet. Messages from buyers will appear here.
					</AppText>
				</View>
			)}
			<FlatList
				data={messages}
				keyExtractor={(message) => message.id}
				renderItem={({ item }) => (
					<ListItem
						title={`${item.senderName} - ${item.listingTitle}`}
						subTitle={item.message}
						image={
							item.listingImage
								? { uri: item.listingImage }
								: require("../assets/images/person.jpg")
						}
						onPress={() => handleMessagePress(item)}
						renderRightActions={() => (
							<ListItemDeleteAction onPress={() => handleDelete(item)} />
						)}
					/>
				)}
				ItemSeparatorComponent={ListItemSeparator}
				refreshing={refreshing}
				onRefresh={handleRefresh}
			/>
		</Screen>
	);
}

export default MessagesScreen;

const styles = StyleSheet.create({
	emptyContainer: {
		padding: 20,
		alignItems: "center",
		justifyContent: "center",
	},
	emptyText: {
		textAlign: "center",
		color: "#999",
		fontSize: 16,
	},
});
