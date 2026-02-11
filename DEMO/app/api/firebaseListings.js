import {
	addListingToFirestore,
	getListingsFromFirestore,
	getUserListingsFromFirestore,
	deleteListingFromFirestore,
} from "../services/firebaseFirestore";
import { uploadImageAsync } from "../services/firebaseStorage";

// Add a new listing
export const addListing = async (listing, onUploadProgress, user) => {
	try {
		// Upload images to Firebase Storage first
		const uploadedImageUrls = [];

		if (listing.images && listing.images.length > 0) {
			if (onUploadProgress) onUploadProgress(0.1);

			for (let i = 0; i < listing.images.length; i++) {
				const image = listing.images[i];
				// Each image can be a string URI or an object with uri property
				const imageUri = typeof image === "string" ? image : image.uri;

				if (imageUri) {
					// Upload to Firebase Storage
					const path = `listings/${user.id}/${Date.now()}_${i}.jpg`;
					const downloadUrl = await uploadImageAsync(imageUri, path);

					uploadedImageUrls.push({
						url: downloadUrl,
						thumbnailUrl: downloadUrl, // You can create actual thumbnails if needed
					});

					// Update progress
					const uploadProgress = 0.1 + (0.6 * (i + 1)) / listing.images.length;
					if (onUploadProgress) onUploadProgress(uploadProgress);
				}
			}
		}

		// Create listing with uploaded image URLs
		const listingWithImages = {
			...listing,
			images: uploadedImageUrls,
		};

		if (onUploadProgress) onUploadProgress(0.8);

		const result = await addListingToFirestore(listingWithImages, user);

		if (onUploadProgress) onUploadProgress(1);

		return result;
	} catch (error) {
		return { ok: false, error: error.message };
	}
};

// Get all listings
const getListings = async () => {
	return await getListingsFromFirestore();
};

// Get user-specific listings
const getUserListings = async (userId) => {
	return await getUserListingsFromFirestore(userId);
};

// Delete a listing
const deleteListing = async (listingId) => {
	return await deleteListingFromFirestore(listingId);
};

export default {
	addListing,
	getListings,
	getUserListings,
	deleteListing,
};
