import React from "react";
import { View, StyleSheet, Image, TouchableHighlight } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import AppText from "../AppText";
import colors from "../../config/colors";

const ListItem = React.memo(
	({ title, subTitle, image, IconComponent, onPress, renderRightActions }) => {
		return (
			<Swipeable renderRightActions={renderRightActions}>
				<TouchableHighlight underlayColor={colors.light} onPress={onPress}>
					<View style={styles.container}>
						{IconComponent}
						{image && <Image style={styles.image} source={image} />}
						<View style={styles.detailsContainer}>
							<AppText style={styles.title} numberOfLines={1}>
								{title}
							</AppText>
							{subTitle && (
								<AppText style={styles.subTitle} numberOfLines={2}>
									{subTitle}
								</AppText>
							)}
						</View>
						<MaterialCommunityIcons
							color={colors.medium}
							name="chevron-right"
							size={25}
						/>
					</View>
				</TouchableHighlight>
			</Swipeable>
		);
	},
);

ListItem.displayName = "ListItem";

export default ListItem;

const styles = StyleSheet.create({
	container: {
		alignItems: "center",
		flexDirection: "row",
		padding: 15,
		backgroundColor: colors.white,
	},
	image: {
		width: 70,
		height: 70,
		borderRadius: 35,
	},
	detailsContainer: {
		flex: 1,
		marginLeft: 10,
		justifyContent: "center",
	},
	title: {
		fontWeight: "500",
	},
	subTitle: {
		color: colors.medium,
	},
});
