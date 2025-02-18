import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Task {
    id: string,
    name: string,
    completed: boolean,
    created_at: string,
    description: string | null,
    important: boolean,
    list_id: string,
    owner_id: string
}

type TasksState = Task[];

const initialState: TasksState = [];

const listsSlice = createSlice({
    name: "tasks",
    initialState,
    reducers: {
        setTasks: (state, action: PayloadAction<TasksState>) => {
            return action.payload;
        },
        clearTasks: () => initialState,
    },
});

export const { setTasks, clearTasks } = listsSlice.actions;
export const selectTasks = (state: { userData: TasksState }) => state.userData;
export default listsSlice.reducer;