import { configureStore } from "@reduxjs/toolkit";
import translationReducer from "./slice/translationSlice";
import typographyReducer from "./slice/typographySlice";
import utilsReducer from "./slice/utilsSlice";

export const store = configureStore({
  reducer: {
    translation: translationReducer,
    typography: typographyReducer,
    utils: utilsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
