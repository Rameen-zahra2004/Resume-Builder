
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

type SelectionState = { selectedId: string | null };

const initialState: SelectionState = { selectedId: null };

const selectionSlice = createSlice({
  name: "selection",
  initialState,
  reducers: {
    select(state, action: PayloadAction<string | null>) {
      state.selectedId = action.payload;
    },
    clear(state) {
      state.selectedId = null;
    },
  },
});

export const { select, clear } = selectionSlice.actions;
export default selectionSlice.reducer;

// Selector with typed state
export const selectSelectedId = (state: RootState) => state.selection.selectedId;
