import { createSlice } from "@reduxjs/toolkit";

type UtilityState = {
  theme_mode: "light" | "dark";
};

const initialState: UtilityState = {
  theme_mode: "light",
};

const utilsSlice = createSlice({
  name: "utils",
  initialState,
  reducers: {
    toggleThemeMode(state) {
      state.theme_mode = state.theme_mode === "light" ? "dark" : "light";
    },
  },
});

export const { toggleThemeMode } = utilsSlice.actions;

export default utilsSlice.reducer;
