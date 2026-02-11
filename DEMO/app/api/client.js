import { create } from "apisauce";
import cache from "../utility/cache";
import { useAuth } from "../auth/context";

const apiClient = create({
	baseURL: "http://192.168.1.9:9000/api", // Update this to your backend IP/port
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
