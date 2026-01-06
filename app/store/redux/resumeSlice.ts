


import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { Resume, ResumeFormData } from "../../types/resume";

/* ================= MOCK BACKEND ================= */
// Make sure this is a normal mutable array
let mockResumes: Resume[] = [];

/* ================= ASYNC THUNKS ================= */
export const fetchResumes = createAsyncThunk("resumes/fetch", async () => {
  return mockResumes;
});

export const addResume = createAsyncThunk(
  "resumes/add",
  async (resume: Resume) => {
    // Immutable update instead of push
    mockResumes = [...mockResumes, resume];
    return resume;
  }
);

export const updateResume = createAsyncThunk(
  "resumes/update",
  async (updatedResume: Resume) => {
    mockResumes = mockResumes.map((r) =>
      r.id === updatedResume.id ? updatedResume : r
    );
    return updatedResume;
  }
);

export const deleteResume = createAsyncThunk(
  "resumes/delete",
  async (id: number) => {
    mockResumes = mockResumes.filter((r) => r.id !== id);
    return id;
  }
);

/* ================= STATE ================= */
interface ResumeState {
  items: Resume[];
  currentDraft: ResumeFormData | null; // ✅ FORM / PREVIEW
  currentResume: Resume | null;        // ✅ SAVED RESUME
  loading: boolean;
  error?: string;
}

const initialState: ResumeState = {
  items: [],
  currentDraft: null,
  currentResume: null,
  loading: false,
};

/* ================= SLICE ================= */
const resumeSlice = createSlice({
  name: "resumes",
  initialState,
  reducers: {
    /* ✅ PREVIEW FLOW */
    setCurrentDraft(state, action: PayloadAction<ResumeFormData>) {
      state.currentDraft = action.payload;
    },
    clearCurrentDraft(state) {
      state.currentDraft = null;
    },

    /* ✅ SAVED RESUME FLOW */
    setCurrentResume(state, action: PayloadAction<Resume>) {
      state.currentResume = action.payload;
    },
    clearCurrentResume(state) {
      state.currentResume = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchResumes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchResumes.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchResumes.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to fetch resumes";
      })
      .addCase(addResume.fulfilled, (state, action) => {
        // Immutable update to prevent frozen object errors
        state.items = [...state.items, action.payload];
      })
      .addCase(updateResume.fulfilled, (state, action) => {
        state.items = state.items.map((r) =>
          r.id === action.payload.id ? action.payload : r
        );
      })
      .addCase(deleteResume.fulfilled, (state, action) => {
        state.items = state.items.filter((r) => r.id !== action.payload);
      });
  },
});

/* ================= EXPORTS ================= */
export const {
  setCurrentDraft,
  clearCurrentDraft,
  setCurrentResume,
  clearCurrentResume,
} = resumeSlice.actions;

export default resumeSlice.reducer;
