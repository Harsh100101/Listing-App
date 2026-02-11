import React, { useState } from "react";
import { Image, StyleSheet, Alert, Pressable } from "react-native";

function ImageInput({ uri, onRemove }) {
	const [lastTap, setLastTap] = useState(null);

	const handlePress = () => {
		const now = Date.now();
		const DOUBLE_TAP_DELAY = 300;

		if (lastTap && now - lastTap < DOUBLE_TAP_DELAY) {
			Alert.alert("Delete Image", "Do you want to delete this image?", [
				{ text: "Cancel", style: "cancel" },
				{
					text: "Delete",
					style: "destructive",
					onPress: () => onRemove(uri),
				},
			]);
		}

		setLastTap(now);
	};

	return (
		<Pressable onPress={handlePress}>
			<Image source={{ uri }} style={styles.image} />
		</Pressable>
	);
}

export default ImageInput;

const styles = StyleSheet.create({
	image: {
		width: 100,
		height: 100,
		borderRadius: 15,
		marginRight: 10,
	},
});
