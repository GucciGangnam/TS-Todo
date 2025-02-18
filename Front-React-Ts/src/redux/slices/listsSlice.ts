import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface List {
    id: string;
    name: string;
    color: 'element-fill' | 'red' | 'orange' | 'yellow' | 'green' | 'purple';
    task_count: number;
}

type ListsState = List[];

const initialState: ListsState = [];

const listsSlice = createSlice({
    name: "lists",
    initialState,
    reducers: {
        setLists: (state, action: PayloadAction<ListsState>) => {
            return action.payload;
        },
        clearLists: () => initialState,
    },
});

export const { setLists, clearLists } = listsSlice.actions;
export const selectLists = (state: { listsData: ListsState }) => state.listsData;
export default listsSlice.reducer;