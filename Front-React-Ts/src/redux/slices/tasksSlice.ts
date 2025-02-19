import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Task {
    id: string,
    name: string,
    completed: boolean,
    created_at: string,
    description: string | null,
    important: boolean,
    list_id: string,
    owner_id: string,
    due_date: string | null,
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
        addTempTask: (state, action: PayloadAction<Task>) => {
            state.push(action.payload);
        },
        removeTempTask: (state, action: PayloadAction<string>) => {
            return state.filter(task => task.id !== action.payload);
        },
        clearTasks: () => initialState,
    },
});

export const { setTasks, clearTasks, addTempTask, removeTempTask } = listsSlice.actions;
export const selectTasks = (state: { tasksData: TasksState }) => state.tasksData;
export default listsSlice.reducer;