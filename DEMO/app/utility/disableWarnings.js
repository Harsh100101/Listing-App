import { LogBox } from "react-native";

// Suppress specific deprecated warnings from Expo internal packages
// These are from expo-image-picker's internal use of expo-file-system
// The warnings don't affect app functionality and will be fixed in future Expo updates
LogBox.ignoreLogs([
	"Method getInfoAsync imported from",
	"Method makeDirectoryAsync imported from",
	"expo-file-system",
]);

// Alternative: Suppress all warnings (not recommended as you'll miss real issues)
// LogBox.ignoreAllLogs();
