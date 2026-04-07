import axios from "axios";



export const getSecureUrl = (url) => {
    if (!url) return "";
    return url.replace("http://", "https://");
};


const axiosInstance = axios.create({
    baseURL: "http://localhost:8000/api/v1", 
    withCredentials: true,
});

// Response interceptor: Jab backend se error aaye
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Agar 401 error aata hai (Unauthorized) aur ye retry nahi hai
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Aapka backend method call ho raha hai yahan
                await axiosInstance.post("/users/refresh-token"); 
                
                // Nayi cookie set hone ke baad purani request firse try karo
                return axiosInstance(originalRequest);
            } catch (err) {
                // Agar refresh token bhi expire ho gaya, toh login pe bhejo
                window.location.href = "/login";
                return Promise.reject(err);
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;