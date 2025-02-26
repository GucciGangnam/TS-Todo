import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
    authToken: string | null;
    name: string;
    email: string;
}

const initialState: UserState = {
    authToken: null,
    name: '',
    email: '',
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<UserState>) => {
            Object.assign(state, action.payload); // Mutates state safely
        },
        clearUser: () => initialState,
    },
});

export const { setUser, clearUser } = userSlice.actions;
export const selectUser = (state: { userData: UserState }) => state.userData;
export default userSlice.reducer;