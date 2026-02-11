import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import Card from "../components/Card";
import colors from "../config/colors";
import listingApi from "../api/firebaseListings";
import routes from "../navigation/routes";
import Screen from "../components/Screen";
import AppText from "../components/AppText";
import ActivityIndicator from "app/components/ActivityIndicator";
import useApi from "app/hooks/useApi";
import ListItem from "../components/lists/ListItem";
import ListItemDeleteAction from "../components/lists/ListItemDeleteAction";
import ListItemSeparator from "../components/lists/ListItemSeparator";
import { useFirebaseAuth } from "../auth/firebaseContext";

function MyListingsScreen({ navigation }) {
	const { user } = useFirebaseAuth();
	const getListingsApi = useApi(listingApi.getUserListings);
	const [deleting, setDeleting] = useState(false);

	useEffect(() => {
		if (user?.id) {
			getListingsApi.request(user.id);
		}
	}, [user]);

	// Refresh listings when screen comes into focus
	useFocusEffect(
		React.useCallback(() => {
			if (user?.id) {
				getListingsApi.request(user.id);
			}
		}, [user]),
	);

	const handleDelete = async (listing) => {
		Alert.alert(
			"Delete Listing",
			`Are you sure you want to delete "${listing.title}"? This action cannot be undone.`,
			[
				{
					text: "Cancel",
					style: "cancel",
				},
				{
					text: "Delete",
					style: "destructive",
					onPress: async () => {
						setDeleting(true);
						const result = await listingApi.deleteListing(listing.id);
						if (result.ok) {
							// Remove from local state immediately
							const updatedListings = getListingsApi.data.filter(
								(item) => item.id !== listing.id,
							);
							getListingsApi.data = updatedListings;
							// Force re-render
							getListingsApi.request(user.id);
							Alert.alert("Success", "Listing deleted successfully.");
						} else {
							Alert.alert(
								"Error",
								"Failed to delete listing. Please try again.",
							);
						}
						setDeleting(false);
					},
				},
			],
		);
	};

	return (
		<Screen style={styles.screen}>
			{getListingsApi.error && (
				<AppText style={styles.errorText}>
					Couldn't retrieve your listings.
				</AppText>
			)}
			{getListingsApi.data?.length === 0 && !getListingsApi.loading && (
				<AppText style={styles.emptyText}>
					You haven't posted any listings yet.
				</AppText>
			)}
			<ActivityIndicator visible={getListingsApi.loading || deleting} />
			<FlatList
				data={getListingsApi.data}
				keyExtractor={(listing) => listing.id.toString()}
				renderItem={({ item }) => (
					<ListItem
						title={item.title}
						subTitle={`$${item.price}`}
						image={
							item.images?.[0]?.url || item.images?.[0]
								? { uri: item.images[0]?.url || item.images[0] }
								: require("../assets/images/person.jpg")
						}
						onPress={() =>
							navigation.navigate("Feed", {
								screen: routes.LISTING_DETAILS,
								params: item,
							})
						}
						renderRightActions={() => (
							<ListItemDeleteAction onPress={() => handleDelete(item)} />
						)}
					/>
				)}
				ItemSeparatorComponent={ListItemSeparator}
			/>
		</Screen>
	);
}

export default MyListingsScreen;

const styles = StyleSheet.create({
	screen: {
		padding: 10,
		backgroundColor: colors.light,
	},
	errorText: {
		textAlign: "center",
		marginTop: 20,
		color: colors.danger,
	},
	emptyText: {
		textAlign: "center",
		marginTop: 20,
		color: colors.medium,
		fontSize: 16,
	},
});
