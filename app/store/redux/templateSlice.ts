
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TemplateType } from "../../types/resume";

interface TemplateState {
  selectedTemplate: TemplateType | null;
}

const initialState: TemplateState = { selectedTemplate: null };

const templateSlice = createSlice({
  name: "template",
  initialState,
  reducers: {
    selectTemplate: (state, action: PayloadAction<TemplateType>) => {
      state.selectedTemplate = action.payload;
    },
  },
});

export const { selectTemplate } = templateSlice.actions;
export default templateSlice.reducer;
