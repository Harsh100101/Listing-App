import {
	collection,
	addDoc,
	getDocs,
	getDoc,
	doc,
	query,
	where,
	orderBy,
	serverTimestamp,
	updateDoc,
	deleteDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import { devLog, devError } from "../utility/devLog";

const LISTINGS_COLLECTION = "listings";
const MESSAGES_COLLECTION = "messages";

// Add a new listing to Firestore
export const addListingToFirestore = async (listing, user) => {
	try {
		devLog("📝 Firestore: Adding new listing...");
		const listingData = {
			title: listing.title,
			price: listing.price,
			category: listing.category,
			description: listing.description || "",
			images: listing.images || [],
			location: listing.location,
			userId: user.id,
			userName: user.name,
			userEmail: user.email,
			createdAt: serverTimestamp(),
		};

		const docRef = await addDoc(
			collection(db, LISTINGS_COLLECTION),
			listingData,
		);
		devLog("✅ Firestore: Listing added with ID:", docRef.id);

		return {
			ok: true,
			data: { id: docRef.id, ...listingData },
		};
	} catch (error) {
		devError("❌ Firestore: Error adding listing:", error);
		return {
			ok: false,
			error: error.message,
		};
	}
};

// Get all listings from Firestore
export const getListingsFromFirestore = async () => {
	try {
		devLog("📋 Firestore: Fetching all listings...");
		const q = query(
			collection(db, LISTINGS_COLLECTION),
			orderBy("createdAt", "desc"),
		);
		const querySnapshot = await getDocs(q);

		const listings = [];
		querySnapshot.forEach((doc) => {
			listings.push({
				id: doc.id,
				...doc.data(),
			});
		});

		devLog(`✅ Firestore: Retrieved ${listings.length} listings`);
		return {
			ok: true,
			data: listings,
		};
	} catch (error) {
		devError("❌ Firestore: Error getting listings:", error);
		return {
			ok: false,
			data: [],
			error: error.message,
		};
	}
};

// Get listings for a specific user
export const getUserListingsFromFirestore = async (userId) => {
	try {
		devLog("📋 Firestore: Fetching listings for user:", userId);

		// Simple query without orderBy to avoid needing a composite index
		// Once you create the index in Firebase Console, you can add back: orderBy("createdAt", "desc")
		const q = query(
			collection(db, LISTINGS_COLLECTION),
			where("userId", "==", userId),
		);
		const querySnapshot = await getDocs(q);

		const listings = [];
		querySnapshot.forEach((doc) => {
			listings.push({
				id: doc.id,
				...doc.data(),
			});
		});

		// Sort in memory by createdAt if available
		listings.sort((a, b) => {
			const timeA = a.createdAt?.toMillis?.() || 0;
			const timeB = b.createdAt?.toMillis?.() || 0;
			return timeB - timeA; // Descending order (newest first)
		});

		devLog(`✅ Firestore: Retrieved ${listings.length} user listings`);
		return {
			ok: true,
			data: listings,
		};
	} catch (error) {
		devError("❌ Firestore: Error getting user listings:", error);
		return {
			ok: false,
			data: [],
			error: error.message,
		};
	}
};

// Get a single listing by ID
export const getListingByIdFromFirestore = async (listingId) => {
	try {
		devLog("📋 Firestore: Fetching listing:", listingId);
		const docRef = doc(db, LISTINGS_COLLECTION, listingId);
		const docSnap = await getDoc(docRef);

		if (docSnap.exists()) {
			devLog("✅ Firestore: Retrieved listing");
			return {
				ok: true,
				data: { id: docSnap.id, ...docSnap.data() },
			};
		} else {
			devLog("❌ Firestore: Listing not found");
			return {
				ok: false,
				error: "Listing not found",
			};
		}
	} catch (error) {
		devError("❌ Firestore: Error getting listing:", error);
		return {
			ok: false,
			error: error.message,
		};
	}
};

// Save a message to Firestore
export const saveMessageToFirestore = async (message) => {
	try {
		devLog("💬 Firestore: Saving message...");
		const messageData = {
			...message,
			createdAt: serverTimestamp(),
		};

		const docRef = await addDoc(
			collection(db, MESSAGES_COLLECTION),
			messageData,
		);
		devLog("✅ Firestore: Message saved with ID:", docRef.id);

		return {
			ok: true,
			data: { id: docRef.id, ...messageData },
		};
	} catch (error) {
		devError("❌ Firestore: Error saving message:", error);
		return {
			ok: false,
			error: error.message,
		};
	}
};

// Get messages for a user
export const getUserMessagesFromFirestore = async (userId) => {
	try {
		devLog("💬 Firestore: Fetching messages for user:", userId);

		// Simple query without orderBy to avoid needing a composite index
		const q = query(
			collection(db, MESSAGES_COLLECTION),
			where("recipientId", "==", userId),
		);
		const querySnapshot = await getDocs(q);

		const messages = [];
		querySnapshot.forEach((doc) => {
			messages.push({
				id: doc.id,
				...doc.data(),
			});
		});

		// Sort in memory by createdAt if available
		messages.sort((a, b) => {
			const timeA = a.createdAt?.toMillis?.() || 0;
			const timeB = b.createdAt?.toMillis?.() || 0;
			return timeB - timeA; // Descending order (newest first)
		});

		devLog(`✅ Firestore: Retrieved ${messages.length} messages`);
		return {
			ok: true,
			data: messages,
		};
	} catch (error) {
		devError("❌ Firestore: Error getting messages:", error);
		return {
			ok: false,
			data: [],
			error: error.message,
		};
	}
};

// Get conversation messages between two users about a specific listing
export const getConversationMessagesFromFirestore = async (
	listingId,
	userId1,
	userId2,
) => {
	try {
		devLog(
			"💬 Firestore: Fetching conversation messages for listing:",
			listingId,
		);

		// Get all messages for this listing where either user is sender/recipient
		const q = query(
			collection(db, MESSAGES_COLLECTION),
			where("listingId", "==", listingId),
		);
		const querySnapshot = await getDocs(q);

		const messages = [];
		querySnapshot.forEach((doc) => {
			const data = doc.data();
			// Filter messages between the two users
			if (
				(data.senderId === userId1 && data.recipientId === userId2) ||
				(data.senderId === userId2 && data.recipientId === userId1)
			) {
				messages.push({
					id: doc.id,
					...data,
				});
			}
		});

		// Sort in memory by createdAt (newest last for chat view)
		messages.sort((a, b) => {
			const timeA = a.createdAt?.toMillis?.() || 0;
			const timeB = b.createdAt?.toMillis?.() || 0;
			return timeB - timeA; // Descending order for inverted FlatList
		});

		devLog(`✅ Firestore: Retrieved ${messages.length} conversation messages`);
		return {
			ok: true,
			data: messages,
		};
	} catch (error) {
		devError("❌ Firestore: Error getting conversation messages:", error);
		return {
			ok: false,
			data: [],
			error: error.message,
		};
	}
};

// Delete a message
export const deleteMessageFromFirestore = async (messageId) => {
	try {
		devLog("🗑️ Firestore: Deleting message:", messageId);
		await deleteDoc(doc(db, MESSAGES_COLLECTION, messageId));
		devLog("✅ Firestore: Message deleted");
		return { ok: true };
	} catch (error) {
		devError("❌ Firestore: Error deleting message:", error);
		return {
			ok: false,
			error: error.message,
		};
	}
};

// Delete a listing
export const deleteListingFromFirestore = async (listingId) => {
	try {
		devLog("🗑️ Firestore: Deleting listing:", listingId);
		await deleteDoc(doc(db, LISTINGS_COLLECTION, listingId));
		devLog("✅ Firestore: Listing deleted");
		return { ok: true };
	} catch (error) {
		devError("❌ Firestore: Error deleting listing:", error);
		return {
			ok: false,
			error: error.message,
		};
	}
};

// Update a listing
export const updateListingInFirestore = async (listingId, updates) => {
	try {
		devLog("📝 Firestore: Updating listing:", listingId);
		const listingRef = doc(db, LISTINGS_COLLECTION, listingId);
		await updateDoc(listingRef, {
			...updates,
			updatedAt: serverTimestamp(),
		});
		devLog("✅ Firestore: Listing updated");
		return { ok: true };
	} catch (error) {
		devError("❌ Firestore: Error updating listing:", error);
		return {
			ok: false,
			error: error.message,
		};
	}
};
