import React, { useState } from "react";
import { Image, StyleSheet, Alert } from "react-native";
import * as Yup from "yup";
import AppText from "../components/AppText";
import {
	ErrorMessage,
	AppForm,
	AppFormField,
	SubmitButton,
} from "../components/forms";
import { useFirebaseAuth } from "../auth/firebaseContext";

import Screen from "../components/Screen";

const validationSchema = Yup.object().shape({
	email: Yup.string().required().email().label("Email"),
	password: Yup.string().required().min(4).label("Password"),
});

function LoginScreen(props) {
	const [loginFailed, setLoginFailed] = useState(false);
	const [loginError, setLoginError] = useState("");

	// Use authentication context
	const { login, isLoading } = useFirebaseAuth();

	// Prefill values from navigation params
	const prefillEmail = props.route?.params?.prefillEmail || "";
	const prefillPassword = props.route?.params?.prefillPassword || "";

	const handleSubmit = async ({ email, password }) => {
		setLoginFailed(false);
		setLoginError("");

		try {
			if (!login) {
				throw new Error("Login function is not available from context");
			}

			const result = await login(email, password);

			if (!result) {
				throw new Error("Login function returned undefined result");
			}

			if (result.success) {
				// No alert, navigation will switch automatically
				return;
			} else {
				setLoginFailed(true);
				setLoginError(result.error || "Login failed");
			}
		} catch (error) {
			setLoginFailed(true);
			setLoginError(error.message || "Login failed");
		}
	};

	return (
		<Screen style={styles.container}>
			<Image
				style={styles.logo}
				source={require("../assets/images/logo.png")}
			/>

			<AppForm
				initialValues={{
					email: prefillEmail,
					password: prefillPassword,
				}}
				enableReinitialize={true}
				onSubmit={handleSubmit}
				validationSchema={validationSchema}
			>
				<ErrorMessage
					error={loginError || "Invalid email and/or password."}
					visible={loginFailed}
				/>
				<AppFormField
					autoCapitalize="none"
					autoCorrect={false}
					icon="email"
					keyboardType="email-address"
					name="email"
					placeholder="Email"
					textContentType="emailAddress"
				/>
				<AppFormField
					autoCapitalize="none"
					autoCorrect={false}
					icon="lock"
					name="password"
					placeholder="Password"
					secureTextEntry
					textContentType="password"
				/>
				<SubmitButton title="Login" />
			</AppForm>
		</Screen>
	);
}

export default LoginScreen;

const styles = StyleSheet.create({
	container: {
		padding: 10,
	},
	logo: {
		width: 80,
		height: 80,
		alignSelf: "center",
		marginTop: 50,
		marginBottom: 20,
	},
	demoInfo: {
		marginTop: 20,
		padding: 15,
		backgroundColor: "#f5f5f5",
		borderRadius: 8,
		fontSize: 12,
		color: "#666",
		textAlign: "center",
	},
});
