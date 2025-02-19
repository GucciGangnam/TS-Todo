import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface List {
    id: string;
    name: string;
    color: 'element-fill' | 'red' | 'orange' | 'yellow' | 'green' | 'purple' | 'blue';
    created_at: string;
    owner_id: string;
    task_count: number;
}

interface trueList {
    listToUpdate: string;
    id: string;
    name: string;
    color: 'element-fill' | 'red' | 'orange' | 'yellow' | 'green' | 'purple' | 'blue';
    created_at: string;
    owner_id: string;
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
        addTempList: (state, action: PayloadAction<List>) => {
            state.push(action.payload);
        },
        updateTempList: (state, action: PayloadAction<trueList>) => {
            const index = state.findIndex(list => list.id === action.payload.listToUpdate);
            // remove listToUpdate from the payload and update the list with the new data
            state[index] = {
                id: action.payload.id,
                name: action.payload.name,
                color: action.payload.color,
                created_at: action.payload.created_at,
                owner_id: action.payload.owner_id,
                task_count: action.payload.task_count,
            };
        },
        removeTempList: (state, action: PayloadAction<string>) => {
            return state.filter(list => list.id !== action.payload);
            //action.payload is the id of the list to remove and they payload will be formatted like this: 'listId'
        },
        updateListColor: (state, action: PayloadAction<{ listId: string, newColor: 'element-fill' | 'red' | 'orange' | 'yellow' | 'green' | 'purple' | 'blue' }>) => {
            const index = state.findIndex(list => list.id === action.payload.listId);
            state[index].color = action.payload.newColor;
        },
        clearLists: () => initialState,
    },
});

export const { setLists, addTempList, clearLists, updateTempList, removeTempList, updateListColor } = listsSlice.actions;
export const selectLists = (state: { listsData: ListsState }) => state.listsData;
export default listsSlice.reducer;