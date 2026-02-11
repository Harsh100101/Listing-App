import client from "./client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { devLog, devError } from "../utility/devLog";

const endpoint = "/listings";

const LISTINGS_KEY = "userListings";

// Get local listings from AsyncStorage
const getLocalListings = async () => {
	try {
		const listings = await AsyncStorage.getItem(LISTINGS_KEY);
		return listings ? JSON.parse(listings) : [];
	} catch (error) {
		devError("Error getting local listings:", error);
		return [];
	}
};

// Save listing locally
const saveLocalListing = async (listing) => {
	try {
		const existingListings = await getLocalListings();
		const newListing = {
			id: Date.now(),
			...listing,
			createdAt: new Date().toISOString(),
		};
		existingListings.push(newListing);
		await AsyncStorage.setItem(LISTINGS_KEY, JSON.stringify(existingListings));
		devLog("📝 Listing saved locally:", newListing);
		return { ok: true, data: newListing };
	} catch (error) {
		devError("Error saving local listing:", error);
		return { ok: false, error: error.message };
	}
};

// Get all listings (local + remote)
const getListings = async () => {
	try {
		// Get local listings first
		const localListings = await getLocalListings();

		// Try to get remote listings
		const response = await client.get(endpoint);

		if (response.ok) {
			// Merge remote and local listings
			const allListings = [...localListings, ...response.data];
			return { ok: true, data: allListings };
		}

		// If remote fails, return local only
		return { ok: true, data: localListings };
	} catch (error) {
		// If everything fails, return local listings
		const localListings = await getLocalListings();
		return { ok: true, data: localListings };
	}
};

// Get listings for a specific user
const getUserListings = async (userId) => {
	try {
		const localListings = await getLocalListings();

		// Filter listings by userId
		const userListings = localListings.filter(
			(listing) => listing.userId === userId,
		);

		devLog(`📋 Found ${userListings.length} listings for user ${userId}`);
		return { ok: true, data: userListings };
	} catch (error) {
		devError("Error getting user listings:", error);
		return { ok: false, data: [], error: error.message };
	}
};

export const addListing = async (listing, onUploadProgress, user) => {
	try {
		// Save locally with user information
		const localListing = {
			title: listing.title,
			price: listing.price,
			category: listing.category,
			description: listing.description || "",
			images: listing.images.map((uri, index) => ({
				url: uri,
				thumbnailUrl: uri,
			})),
			location: listing.location,
			userId: user?.id,
			userName: user?.name || "Unknown User",
			userEmail: user?.email,
		};

		// Simulate upload progress
		if (onUploadProgress) {
			onUploadProgress(0.3);
		}

		// Save to local storage
		const result = await saveLocalListing(localListing);

		if (onUploadProgress) {
			onUploadProgress(1);
		}

		return result;
	} catch (error) {
		devError("Error adding listing:", error);
		return { ok: false, error: error.message };
	}
};

export default {
	addListing,
	getListings,
	getLocalListings,
	getUserListings,
};
