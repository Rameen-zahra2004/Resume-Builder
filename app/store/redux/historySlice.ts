
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Element } from "../../types/resume";
import type { RootState } from "../store";

type HistoryState = {
  past: Element[][];
  present: Element[];
  future: Element[][];
};

const initialState: HistoryState = { past: [], present: [], future: [] };

const historySlice = createSlice({
  name: "history",
  initialState,
  reducers: {
    capture(state, action: PayloadAction<Element[]>) {
      state.past.push(state.present);
      state.present = action.payload;
      state.future = [];
      const MAX = 50;
      if (state.past.length > MAX) state.past.shift();
    },
    undo(state) {
      if (state.past.length === 0) return;
      const previous = state.past.pop()!;
      state.future.unshift(state.present);
      state.present = previous;
    },
    redo(state) {
      if (state.future.length === 0) return;
      const next = state.future.shift()!;
      state.past.push(state.present);
      state.present = next;
    },
    setPresent(state, action: PayloadAction<Element[]>) {
      state.present = action.payload;
    },
  },
});

export const { capture, undo, redo, setPresent } = historySlice.actions;
export default historySlice.reducer;

// Selector
export const selectHistoryPresent = (state: RootState) => state.history.present;
