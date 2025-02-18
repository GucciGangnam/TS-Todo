import { configureStore } from "@reduxjs/toolkit";
// Slices
import userReducer from "./slices/userSlice"; // Adjust the path if needed
import listsReducer from "./slices/listsSlice";
import tasksReducer from "./slices/tasksSlice";

import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Uses localStorage
import { combineReducers } from "redux";
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist/es/constants";


// Combine reducers (for scalability)
const rootReducer = combineReducers({
    userData: userReducer,
    listsData: listsReducer,
    tasksData: tasksReducer,
});

// Persist config
const persistConfig = {
    key: "root", // Key for localStorage
    storage, // Use localStorage to persist state
};

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER], // Ignore persist actions
            },
        }),
});

// Persistor
export const persistor = persistStore(store);

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Log state updates
store.subscribe(() => {
    console.log("Updated Redux state:", store.getState());
});