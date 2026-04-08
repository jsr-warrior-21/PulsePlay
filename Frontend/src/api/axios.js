import axios from "axios";

export const getSecureUrl = (url) => {
    if (!url) return "";
    return url.replace("http://", "https://");
};

const axiosInstance = axios.create({
    baseURL: "http://localhost:8000/api/v1",
    withCredentials: true,
});

// Response interceptor
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (
            originalRequest.url.includes("/refresh-token") || 
            originalRequest.url.includes("/login")
        ) {
            return Promise.reject(error);
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                await axiosInstance.post("/users/refresh-token"); 
                
                return axiosInstance(originalRequest);
            } catch (err) {
                console.log("Session expired, redirecting to login...");
                
                if (window.location.pathname !== "/login") {
                    window.location.href = "/login";
                }
                return Promise.reject(err);
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;