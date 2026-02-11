import React, { useState, useEffect } from "react";
import {
	View,
	StyleSheet,
	FlatList,
	TextInput,
	TouchableOpacity,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import AppText from "../components/AppText";
import colors from "../config/colors";
import { useFirebaseAuth } from "../auth/firebaseContext";
import {
	getConversationMessagesFromFirestore,
	saveMessageToFirestore,
} from "../services/firebaseFirestore";
import ActivityIndicator from "../components/ActivityIndicator";

function ChatScreen({ route, navigation }) {
	const { conversation } = route.params;
	const { user } = useFirebaseAuth();
	const [messages, setMessages] = useState([]);
	const [newMessage, setNewMessage] = useState("");
	const [loading, setLoading] = useState(true);
	const [sending, setSending] = useState(false);

	// Determine who is the other person in the conversation
	const otherPerson =
		conversation.senderId === user?.id
			? {
					id: conversation.recipientId,
					name: conversation.recipientName,
					email: conversation.recipientEmail,
				}
			: {
					id: conversation.senderId,
					name: conversation.senderName,
					email: conversation.senderEmail,
				};

	const loadMessages = async () => {
		setLoading(true);
		const result = await getConversationMessagesFromFirestore(
			conversation.listingId,
			user.id,
			otherPerson.id,
		);
		if (result.ok) {
			setMessages(result.data);
		}
		setLoading(false);
	};

	useEffect(() => {
		loadMessages();
		navigation.setOptions({
			title: `${otherPerson.name} - ${conversation.listingTitle}`,
		});
	}, []);

	useFocusEffect(
		React.useCallback(() => {
			loadMessages();
		}, [user, otherPerson.id]),
	);

	const handleSendMessage = async () => {
		if (!newMessage.trim() || sending) return;

		setSending(true);

		const messageData = {
			listingId: conversation.listingId,
			listingTitle: conversation.listingTitle,
			listingImage: conversation.listingImage,
			message: newMessage.trim(),
			senderId: user.id,
			senderName: user.name,
			senderEmail: user.email,
			recipientId: otherPerson.id,
			recipientName: otherPerson.name,
			recipientEmail: otherPerson.email,
		};

		const result = await saveMessageToFirestore(messageData);

		if (result.ok) {
			setNewMessage("");
			// Add the new message to the list immediately
			setMessages([result.data, ...messages]);
		}

		setSending(false);
	};

	const renderMessage = ({ item }) => {
		const isMyMessage = item.senderId === user?.id;

		return (
			<View
				style={[
					styles.messageContainer,
					isMyMessage ? styles.myMessage : styles.theirMessage,
				]}
			>
				<View
					style={[
						styles.messageBubble,
						isMyMessage ? styles.myMessageBubble : styles.theirMessageBubble,
					]}
				>
					<AppText
						style={[
							styles.messageText,
							isMyMessage ? styles.myMessageText : styles.theirMessageText,
						]}
					>
						{item.message}
					</AppText>
					<AppText
						style={[
							styles.messageTime,
							isMyMessage ? styles.myMessageTime : styles.theirMessageTime,
						]}
					>
						{item.createdAt?.toDate
							? new Date(item.createdAt.toDate()).toLocaleTimeString([], {
									hour: "2-digit",
									minute: "2-digit",
								})
							: "Now"}
					</AppText>
				</View>
			</View>
		);
	};

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<ActivityIndicator visible={loading} />

			<KeyboardAvoidingView
				style={{ flex: 1 }}
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				keyboardVerticalOffset={Platform.OS === "android" ? 80 : 0}
			>
				<View style={{ flex: 1 }}>
					<FlatList
						data={messages}
						keyExtractor={(item) => item.id}
						renderItem={renderMessage}
						inverted
						contentContainerStyle={{
							flexGrow: 1,
							padding: 10,
							paddingBottom: 20,
						}}
						keyboardShouldPersistTaps="handled"
					/>

					<View style={styles.inputContainer}>
						<TextInput
							style={styles.input}
							placeholder="Type a message..."
							value={newMessage}
							onChangeText={setNewMessage}
							multiline
						/>

						<TouchableOpacity
							onPress={handleSendMessage}
							style={styles.sendButton}
						>
							<MaterialCommunityIcons name="send" size={24} color="white" />
						</TouchableOpacity>
					</View>
				</View>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}

export default ChatScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.white,
	},
	messagesContainer: {
		flex: 1,
	},
	messagesList: {
		padding: 10,
		paddingBottom: 20,
	},
	emptyContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 20,
	},
	emptyText: {
		textAlign: "center",
		color: colors.medium,
		fontSize: 16,
	},
	messageContainer: {
		marginVertical: 5,
		flexDirection: "row",
	},
	myMessage: {
		justifyContent: "flex-end",
	},
	theirMessage: {
		justifyContent: "flex-start",
	},
	messageBubble: {
		maxWidth: "75%",
		padding: 12,
		borderRadius: 20,
	},
	myMessageBubble: {
		backgroundColor: colors.primary,
		borderBottomRightRadius: 4,
	},
	theirMessageBubble: {
		backgroundColor: colors.light,
		borderBottomLeftRadius: 4,
	},
	messageText: {
		fontSize: 16,
	},
	myMessageText: {
		color: colors.white,
	},
	theirMessageText: {
		color: colors.dark,
	},
	messageTime: {
		fontSize: 11,
		marginTop: 4,
	},
	myMessageTime: {
		color: colors.white,
		opacity: 0.8,
		textAlign: "right",
	},
	theirMessageTime: {
		color: colors.medium,
		textAlign: "left",
	},
	inputContainer: {
		flexDirection: "row",
		padding: 15,
		backgroundColor: colors.white,
		borderTopWidth: 1,
		borderTopColor: colors.light,
		alignItems: "flex-end",
		minHeight: 70,
		maxHeight: 150,
	},
	input: {
		flex: 1,
		backgroundColor: colors.white,
		borderWidth: 1,
		borderColor: colors.light,
		borderRadius: 25,
		paddingHorizontal: 15,
		paddingVertical: 12,
		marginRight: 10,
		maxHeight: 100,
		minHeight: 45,
		fontSize: 16,
		color: colors.dark,
		textAlignVertical: "top",
	},
	sendButton: {
		backgroundColor: colors.primary,
		width: 45,
		height: 45,
		borderRadius: 22.5,
		justifyContent: "center",
		alignItems: "center",
	},
	sendButtonDisabled: {
		backgroundColor: colors.light,
	},
});
