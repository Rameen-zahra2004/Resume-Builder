
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Element } from '../../types/resume';
import type { RootState } from '../store';

interface EditorState {
  elements: Element[];
  history: Element[][];
  historyIndex: number;
}

const initialState: EditorState = {
  elements: [],
  history: [],
  historyIndex: -1,
};

const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    setLayout(state, action: PayloadAction<Element[]>) {
      state.elements = action.payload.map((el: Element) => ({ ...el }));

      // Capture history
      state.history = state.history.slice(0, state.historyIndex + 1);
      state.history.push(state.elements);
      state.historyIndex = state.history.length - 1;
    },

    addElement(state, action: PayloadAction<Element>) {
      state.elements.push({ ...action.payload });
      state.history = state.history.slice(0, state.historyIndex + 1);
      state.history.push(state.elements);
      state.historyIndex = state.history.length - 1;
    },

    updateElement(
      state,
      action: PayloadAction<{ id: string; changes: Partial<Element> }>
    ) {
      const { id, changes } = action.payload;
      const index = state.elements.findIndex(el => el.id === id);
      if (index >= 0) {
        state.elements[index] = { ...state.elements[index], ...changes };
        state.history = state.history.slice(0, state.historyIndex + 1);
        state.history.push(state.elements);
        state.historyIndex = state.history.length - 1;
      }
    },

    removeElement(state, action: PayloadAction<string>) {
      state.elements = state.elements.filter(el => el.id !== action.payload);
      state.history = state.history.slice(0, state.historyIndex + 1);
      state.history.push(state.elements);
      state.historyIndex = state.history.length - 1;
    },

    undo(state) {
      if (state.historyIndex > 0) {
        state.historyIndex -= 1;
        state.elements = state.history[state.historyIndex].map(el => ({ ...el }));
      }
    },

    redo(state) {
      if (state.historyIndex < state.history.length - 1) {
        state.historyIndex += 1;
        state.elements = state.history[state.historyIndex].map(el => ({ ...el }));
      }
    },
  },
});

export const { setLayout, addElement, updateElement, removeElement, undo, redo } = editorSlice.actions;
export default editorSlice.reducer;

export const selectElements = (state: RootState): Element[] => state.editor.elements;
