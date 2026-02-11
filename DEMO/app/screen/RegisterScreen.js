import React, { useState } from "react";
import { StyleSheet, Alert } from "react-native";
import * as Yup from "yup";

import Screen from "../components/Screen";
import { AppForm, AppFormField, SubmitButton } from "../components/forms";
import { useFirebaseAuth } from "../auth/firebaseContext";

const validationSchema = Yup.object().shape({
	username: Yup.string().required().label("Username"),
	email: Yup.string().required().email().label("Email"),
	password: Yup.string().required().min(4).label("Password"),
});

function RegisterScreen(props) {
	const { register, login } = useFirebaseAuth();
	const [registerError, setRegisterError] = useState("");

	const handleRegister = async ({ username, email, password }) => {
		setRegisterError("");
		const result = await register(email, password, username);
		if (result.success) {
			// Auto-login after registration
			const loginResult = await login(email, password);
			if (loginResult.success) {
				// Navigation will automatically switch to AppNavigator due to auth state
				return;
			} else {
				Alert.alert(
					"Registration Succeeded, but Login Failed",
					loginResult.error || "Please try logging in manually.",
				);
			}
		} else {
			setRegisterError(result.error || "Registration failed");
			Alert.alert("Registration Failed", result.error || "Registration failed");
		}
	};

	return (
		<Screen style={styles.container}>
			<AppForm
				initialValues={{ username: "", email: "", password: "" }}
				onSubmit={handleRegister}
				validationSchema={validationSchema}
			>
				<AppFormField
					autoCapitalize="none"
					autoCorrect={false}
					icon="account"
					keyboardType="default"
					name="username"
					placeholder="Name"
					textContentType="username"
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
				<SubmitButton title="Register" />
			</AppForm>
		</Screen>
	);
}

export default RegisterScreen;

const styles = StyleSheet.create({
	container: {
		padding: 10,
	},
});
