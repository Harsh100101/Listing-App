import React from "react";
import { View, StyleSheet, ImageBackground, Image, Text } from "react-native";

import colors from "../config/colors";
import AppButton from "../components/AppButton";
import routes from "../navigation/routes";

function WelcomScreen({ navigation }) {
	return (
		<ImageBackground
			style={styles.background}
			source={require("../assets/images/background.jpg")}
			blurRadius={2}
		>
			<View style={styles.logoContainer}>
				<Image
					style={styles.logo}
					source={require("../assets/images/logo.png")}
				/>
				<Text style={styles.tagLine}>Sell What You Don't Need</Text>
			</View>
			<View style={styles.buttonsContainer}>
				<AppButton
					title="Login"
					onPress={() => navigation.navigate(routes.LOGIN)}
				/>
				<AppButton
					title="Register"
					color="secondary"
					onPress={() => navigation.navigate(routes.REGISTER)}
				/>
			</View>
		</ImageBackground>
	);
}

export default WelcomScreen;

const styles = StyleSheet.create({
	background: {
		flex: 1,
		justifyContent: "flex-end",
		alignItems: "center",
	},
	buttonsContainer: {
		padding: 20,
		marginBottom: 10,
		width: "100%",
	},
	logoContainer: {
		position: "absolute",
		top: 70,
		alignItems: "center",
	},
	logo: {
		width: 100,
		height: 100,
	},
	tagLine: {
		fontSize: 25,
		fontWeight: 600,
		paddingVertical: 20,
	},
});
