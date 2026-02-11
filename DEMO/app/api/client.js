import { create } from "apisauce";
import cache from "../utility/cache";
import { useAuth } from "../auth/context";

// Use environment variable for API base URL, with fallback for development
const getApiBaseUrl = () => {
	// Check environment variable first
	if (process.env.EXPO_PUBLIC_API_BASE_URL) {
		return process.env.EXPO_PUBLIC_API_BASE_URL;
	}

	// Development fallbacks
	if (__DEV__) {
		// For local development - adjust IP as needed
		return "http://localhost:3000/api"; // Change this to your local IP if needed
	}

	// Production fallback
	return "https://your-production-api.com/api";
};

const apiClient = create({
	baseURL: getApiBaseUrl(),
	timeout: 10000, // 10 second timeout
});

const get = apiClient.get;
apiClient.get = async (url, params, axiosConfig) => {
	const response = await get(url, params, axiosConfig);

	if (response.ok) {
		cache.store(url, response.data);
		return response;
	}

	const data = await cache.get(url);
	return data ? { ok: true, data } : response;
};

// Attach token to every request if authenticated
export const useProtectedApi = () => {
	const { token } = useAuth();

	// Attach token to headers for all requests
	apiClient.addAsyncRequestTransform(async (request) => {
		if (token) {
			request.headers["Authorization"] = `Bearer ${token}`;
		}
	});

	return apiClient;
};

export default apiClient;
