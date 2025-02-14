import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice"; // Adjust the path if needed

export const store = configureStore({
    reducer: {
        user: userReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Log state updates
store.subscribe(() => {
    console.log("Updated Redux state:", store.getState());
});