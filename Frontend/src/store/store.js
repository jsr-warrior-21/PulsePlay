import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";

const store = configureStore({
    reducer: {
        auth: authSlice,
        // Yahan baki reducers add kar sakte ho
    }
});

export default store;