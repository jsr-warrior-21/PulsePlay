import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";

const store = configureStore({
    reducer: {
        auth: authSlice,
        // Baaki slices (video, tweet) baad mein yahan aayenge
    }
});

export default store;