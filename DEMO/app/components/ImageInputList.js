import React from "react";
import {
	View,
	StyleSheet,
	ScrollView,
	Pressable,
	Image,
	Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

import ImageInput from "./ImageInput";

function ImageInputList({ imageUris = [], onChangeImage }) {
	const handleAddImage = async () => {
		const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

		if (!permission.granted) {
			Alert.alert(
				"Permission required",
				"Please allow access to your media library",
			);
			return;
		}

		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ["images"],
			allowsMultipleSelection: true,
		});

		if (!result.canceled) {
			const newUris = result.assets.map((asset) => asset.uri);
			onChangeImage([...imageUris, ...newUris]);
		}
	};

	const handleRemove = (uri) => {
		onChangeImage(imageUris.filter((img) => img !== uri));
	};

	return (
		<View>
			<ScrollView horizontal>
				<Pressable onPress={handleAddImage}>
					<View style={styles.addContainer}>
						<Image
							source={{
								uri: "https://img.icons8.com/ios-filled/100/plus.png",
							}}
							style={styles.addIcon}
						/>
					</View>
				</Pressable>

				{imageUris.map((uri) => (
					<ImageInput key={uri} uri={uri} onRemove={handleRemove} />
				))}
			</ScrollView>
		</View>
	);
}

export default ImageInputList;

const styles = StyleSheet.create({
	addContainer: {
		width: 100,
		height: 100,
		borderRadius: 15,
		backgroundColor: "#f0f0f0",
		alignItems: "center",
		justifyContent: "center",
		marginRight: 10,
	},
	addIcon: {
		width: 40,
		height: 40,
		opacity: 0.6,
	},
});
