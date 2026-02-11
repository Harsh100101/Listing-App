import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import colors from "../config/colors";

function NewListingButton({ onPress }) {
	return (
		<TouchableOpacity onPress={onPress}>
			<View style={styles.container}>
				<MaterialCommunityIcons
					name="plus-circle"
					color={colors.white}
					size={40}
				/>
			</View>
		</TouchableOpacity>
	);
}

export default NewListingButton;

const styles = StyleSheet.create({
	container: {
		backgroundColor: colors.primary,
		borderColor: colors.white,
		borderWidth: 10,
		height: 80,
		width: 80,
		borderRadius: 40,
		bottom: 20,
		alignItems: "center",
		justifyContent: "center",
		alignSelf: "center",
	},
});
