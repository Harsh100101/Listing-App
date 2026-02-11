import React, { useEffect, useState } from "react";
import * as Yup from "yup";

import {
	AppForm,
	AppFormField,
	AppFormPicker,
	SubmitButton,
} from "../components/forms";
import listingsApi from "app/api/firebaseListings";
import Screen from "../components/Screen";
import CategoryPickerItem from "../components/CategoryPickerItem";
import FormImagePicker from "../components/forms/FormImagePicker";
import useLocation from "../config/hooks/useLocation";
import UploadScreen from "./UploadScreen";
import { useFirebaseAuth } from "../auth/firebaseContext";

const validationSchema = Yup.object().shape({
	title: Yup.string().required().min(1).label("Title"),
	price: Yup.number().required().min(1).max(10000).label("Price"),
	description: Yup.string().label("Description"),
	category: Yup.object().required().nullable().label("Category"),
	images: Yup.array().min(1, "Please select at least one image."),
});

const categories = [
	{ label: "Furniture", value: 1, backgroundColor: "tomato", icon: "lamp" },
	{ label: "Cars", value: 2, backgroundColor: "dodgerblue", icon: "car" },
	{ label: "Camera", value: 3, backgroundColor: "gold", icon: "camera" },
	{ label: "Games", value: 4, backgroundColor: "purple", icon: "gamepad" },
	{ label: "Clothing", value: 5, backgroundColor: "pink", icon: "shoe-heel" },
	{ label: "Sports", value: 6, backgroundColor: "orange", icon: "basketball" },
	{
		label: "Movies & Music",
		value: 7,
		backgroundColor: "teal",
		icon: "headphones",
	},
	{
		label: "Books",
		value: 8,
		backgroundColor: "brown",
		icon: "book-open-blank-variant",
	},
	{
		label: "Others",
		value: 9,
		backgroundColor: "gray",
		icon: "application",
	},
];

function ListingEditScreen(props) {
	const location = useLocation();
	const { user } = useFirebaseAuth();
	const [uploadVisivle, setUploadVisible] = useState(false);
	const [progress, setProgress] = useState(0);

	const handleSubmit = async (listing, { resetForm }) => {
		setProgress(0);
		setUploadVisible(true);

		const result = await listingsApi.addListing(
			{ ...listing, location },
			(progress) => setProgress(progress),
			user,
		);

		if (!result.ok) {
			setUploadVisible(false);
			return alert("Could not save the listing");
		}

		resetForm(); // Reset the form after successful upload

		// Navigate back to feed after successful upload
		if (props.navigation) {
			props.navigation.navigate("Feed");
		}
	};
	return (
		<Screen>
			<UploadScreen
				onDone={() => {
					setUploadVisible(false);
				}}
				progress={progress}
				visible={uploadVisivle}
			/>
			<AppForm
				initialValues={{
					title: "",
					price: "",
					description: "",
					category: null,
					images: [],
				}}
				onSubmit={handleSubmit}
				validationSchema={validationSchema}
			>
				<FormImagePicker name="images" />
				<AppFormField maxLength={255} name="title" placeholder="Title" />
				<AppFormField
					keyboardType="numeric"
					maxLength={8}
					name="price"
					placeholder="Price"
					width={120}
				/>
				<AppFormPicker
					items={categories}
					name="category"
					numberOfColumns={3}
					PickerItemComponent={CategoryPickerItem}
					placeholder="Category"
					width="50%"
				/>
				<AppFormField
					maxLength={255}
					multiline
					name="description"
					numberOfLines={3}
					placeholder="Description"
				/>
				<SubmitButton title="Post" />
			</AppForm>
		</Screen>
	);
}

export default ListingEditScreen;
