import React from "react";
import LottieView from "lottie-react-native";

function ActivityIndicator({ visible = false }) {
	if (!visible) return null;

	return (
		<LottieView
			autoPlay
			loop
			source={require("../assets/animations/Loading.json")}
			style={{ width: 100, height: 100, alignSelf: "center" }} // Add this line
		/>
	);
}

export default ActivityIndicator;
