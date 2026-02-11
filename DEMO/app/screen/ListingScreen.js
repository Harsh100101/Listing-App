import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import Card from "../components/Card";
import colors from "../config/colors";
import listingApi from "../api/firebaseListings";
import routes from "../navigation/routes";
import Screen from "../components/Screen";
import AppText from "../components/AppText";
import AppButton from "../components/AppButton";
import ActivityIndicator from "app/components/ActivityIndicator";
import useApi from "app/hooks/useApi";

function ListingScreen({ navigation }) {
	const getListingsApi = useApi(listingApi.getListings);

	useEffect(() => {
		getListingsApi.request();
	}, []);

	// Refresh listings when screen comes into focus (after adding new listing)
	useFocusEffect(
		React.useCallback(() => {
			getListingsApi.request();
		}, []),
	);

	return (
		<Screen style={styles.screen}>
			{getListingsApi.error && (
				<>
					<AppText>Couldn't retrieve the listings. </AppText>
					<AppButton title="Retry" onPress={loadListings} />
				</>
			)}
			<ActivityIndicator visible={getListingsApi.loading} />
			<FlatList
				data={getListingsApi.data}
				keyExtractor={(listing) => listing.id.toString()}
				renderItem={({ item }) => (
					<Card
						title={item.title}
						subTitle={"$" + item.price}
						imageUrl={item.images?.[0]?.url || item.images?.[0] || ""}
						onPress={() => navigation.navigate(routes.LISTING_DETAILS, item)}
						thumbnailUrl={
							item.images?.[0]?.thumbnailUrl || item.images?.[0] || ""
						}
					/>
				)}
			/>
		</Screen>
	);
}

export default ListingScreen;

const styles = StyleSheet.create({
	screen: {
		padding: 10,
		backgroundColor: colors.light,
	},
});
