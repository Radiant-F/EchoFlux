import { configureStore } from "@reduxjs/toolkit";
import translationReducer from "./slice/translationSlice";
import typographyReducer from "./slice/typographySlice";

export const store = configureStore({
  reducer: {
    translation: translationReducer,
    typography: typographyReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
