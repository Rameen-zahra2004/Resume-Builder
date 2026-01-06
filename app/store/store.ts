

import resumeReducer from "./redux/resumeSlice";
import { configureStore } from '@reduxjs/toolkit';
import editorReducer from '../store/redux/editorSlice';
import selectionReducer from '../store/redux/selectionSlice';
import historyReducer from '../store/redux/historySlice';
import templateReducer from "./redux/templateSlice";


export const store = configureStore({
  reducer: {
    resumes: resumeReducer,
    editor: editorReducer,
selection: selectionReducer,
history: historyReducer,
template: templateReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
