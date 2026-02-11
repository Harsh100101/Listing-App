import React from "react";
import { View, StyleSheet } from "react-native";
import Constants from "expo-constants";
import { useNetInfo } from "@react-native-community/netinfo";

import AppText from "./AppText";
import colors from "app/config/colors";

function OfflineNotice() {
	const netInfo = useNetInfo();

	if (netInfo.type !== "unknown" && netInfo.isInternetReachable === false)
 		return (
			<View style={styles.container}>
				<AppText style={styles.text}>No Internet Connection</AppText>
			</View>
		);

	return null;
}

export default OfflineNotice;

const styles = StyleSheet.create({
	container: {
		height: 50,
		width: "100%",
		backgroundColor: colors.primary,
		alignItems: "center",
		justifyContent: "center",
		position: "absolute",
		top: Constants.statusBarHeight,
		zIndex: 1,
	},
	text: {
		color: colors.white,
	},
});
