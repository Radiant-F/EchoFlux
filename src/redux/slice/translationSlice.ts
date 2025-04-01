import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LanguageCode, languages } from "../../constant";

type TranslationState = {
  translate: {
    source: LanguageCode;
    target: LanguageCode;
  };
  listening: boolean;
  languages: typeof languages;
  translation: string;
};

const initialState: TranslationState = {
  translate: { source: "id", target: "en" },
  listening: false,
  languages: languages,
  translation: "Start listening to translate ...",
};

export const translationSlice = createSlice({
  name: "translation",
  initialState,
  reducers: {
    setTranslateSource: (state, action: PayloadAction<LanguageCode>) => {
      state.translate.source = action.payload;
    },
    setTranslateTarget: (state, action: PayloadAction<LanguageCode>) => {
      state.translate.target = action.payload;
    },
    setListening: (state, action: PayloadAction<boolean>) => {
      state.listening = action.payload;
    },
    setTranslation: (state, action: PayloadAction<string>) => {
      state.translation = action.payload;
    },
  },
});

export const {
  setListening,
  setTranslateSource,
  setTranslateTarget,
  setTranslation,
} = translationSlice.actions;

export default translationSlice.reducer;
