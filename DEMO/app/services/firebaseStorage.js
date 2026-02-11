import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase"; // <-- Correct import

/**
 * Upload image and return download URL
 */

export const uploadImageAsync = async (uri, path) => {
	const response = await fetch(uri);
	const blob = await response.blob();

	const storageRef = ref(storage, path);
	await uploadBytes(storageRef, blob);

	return await getDownloadURL(storageRef);
};
