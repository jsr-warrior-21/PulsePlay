import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://localhost:8000/api/v1",
    withCredentials: true, // Cookies ke liye compulsory hai
});

// Cloudinary HTTP to HTTPS fix
export const getSecureUrl = (url) => {
    if (!url) return "";
    return url.replace("http://", "https://");
};

export default axiosInstance;