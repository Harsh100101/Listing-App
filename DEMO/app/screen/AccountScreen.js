import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import Screen from "../components/Screen";
import ListItem from "../components/lists/ListItem";
import colors from "../config/colors";
import Icon from "../components/Icon";
import ListItemSeparator from "../components/lists/ListItemSeparator";
import routes from "../navigation/routes";
import { useFirebaseAuth } from "../auth/firebaseContext";

const menuItems = [
	{
		title: "My Listing",
		icon: {
			name: "format-list-bulleted",
			backgroundColor: colors.primary,
		},
		targetScreen: routes.MY_LISTINGS,
	},
	{
		title: "My Messages",
		icon: {
			name: "email",
			backgroundColor: colors.secondary,
		},

		targetScreen: routes.MESSAGES,
	},
];

function AccountScreen({ navigation }) {
	const { user, logout } = useFirebaseAuth();
	return (
		<Screen style={styles.screen}>
			<View style={styles.container}>
				<ListItem
					title={user?.name || "Guest"}
					subTitle={user?.email || "Not logged in"}
					image={require("../assets/images/person.jpg")}
				/>
			</View>
			<View style={styles.container}>
				<FlatList
					data={menuItems}
					keyExtractor={(menuItem) => menuItem.title}
					ItemSeparatorComponent={ListItemSeparator}
					renderItem={({ item }) => (
						<ListItem
							title={item.title}
							IconComponent={
								<Icon
									name={item.icon.name}
									backgroundColor={item.icon.backgroundColor}
								/>
							}
							onPress={() => navigation.navigate(item.targetScreen)}
						/>
					)}
				/>
			</View>
			<ListItem
				title="Log out"
				IconComponent={<Icon name="logout" backgroundColor="#ffe66d" />}
				onPress={async () => {
					await logout();
					// Navigation will automatically switch to AuthNavigator due to App.js logic
				}}
			/>
		</Screen>
	);
}

export default AccountScreen;

const styles = StyleSheet.create({
	screen: {
		backgroundColor: colors.light,
	},
	container: {
		marginVertical: 20,
	},
});
