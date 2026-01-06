import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Session } from "next-auth";

interface UserState {
  session: Session | null;
}

const initialState: UserState = {
  session: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setSession: (state, action: PayloadAction<Session | null>) => {
      state.session = action.payload;
    },
    clearSession: (state) => {
      state.session = null;
    },
  },
});

export const { setSession, clearSession } = userSlice.actions;
export default userSlice.reducer;
