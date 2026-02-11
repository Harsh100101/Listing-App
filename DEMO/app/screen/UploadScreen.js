import React from "react";
import { View, StyleSheet, ActivityIndicator, Modal } from "react-native";
import * as Progress from "react-native-progress";
import LottieView from "lottie-react-native";

import AppText from "app/components/AppText";
import colors from "app/config/colors";

function UploadScreen({ progress = 0, visible = false, onDone }) {
	return (
		<Modal visible={visible} transparent>
			<View style={styles.overlay}>
				<View style={styles.container}>
					{progress === 0 ? (
						<ActivityIndicator size="large" />
					) : progress < 1 ? (
						<Progress.Bar
							progress={progress}
							color={colors.primary}
							width={200}
						/>
					) : (
						<LottieView
							source={require("../assets/animations/success.json")}
							autoPlay
							loop={false}
							onAnimationFinish={() => setTimeout(onDone, 1200)}
							style={styles.animation}
						/>
					)}
				</View>
			</View>
		</Modal>
	);
}

export default UploadScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#222", // add this line for testing
	},
	animation: {
		width: 200,
		height: 200,
	},
	overlay: {
		flex: 1,
		backgroundColor: "#222",
		justifyContent: "center",
		alignItems: "center",
	},
});
