import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fontFamilies, FontFamilyName } from "../../constant";

type TypographyState = {
  fontColor: string;
  fontSize: number;
  backgroundColor: string;
  fontStyle: {
    italic: boolean;
    bold: boolean;
    underline: boolean;
  };
  fontFamily: {
    name: FontFamilyName | "Custom";
    url: string;
  };
  fontFamilyList: typeof fontFamilies;
  textShadow: {
    enabled: boolean;
    shadowX: string;
    shadowY: string;
    shadowBlur: string;
    shadowColor: string;
  };
  translationAlignment: {
    viewVertical: "flex-start" | "center" | "flex-end";
    viewHorizontal: "flex-start" | "center" | "flex-end";
    textVertical: "left" | "center" | "right";
    textHorizontal: "left" | "center" | "right";
  };
};

const initialState: TypographyState = {
  fontColor: "#000000",
  backgroundColor: "#00ff00",
  fontSize: 24,
  fontStyle: {
    italic: false,
    bold: false,
    underline: false,
  },
  fontFamily: {
    name: "Arial",
    url: "",
  },
  fontFamilyList: fontFamilies,
  textShadow: {
    enabled: false,
    shadowX: "2",
    shadowY: "2",
    shadowBlur: "1",
    shadowColor: "#000000",
  },
  translationAlignment: {
    textHorizontal: "center",
    textVertical: "center",
    viewHorizontal: "center",
    viewVertical: "center",
  },
};

export const typographySlice = createSlice({
  name: "typography",
  initialState,
  reducers: {
    setFontColor(state, action: PayloadAction<string>) {
      state.fontColor = action.payload;
    },
    setFontSize(state, action: PayloadAction<number>) {
      state.fontSize = action.payload;
    },
    setBackgroundColor(state, action: PayloadAction<string>) {
      state.backgroundColor = action.payload;
    },
    setFontFamily(state, action: PayloadAction<TypographyState["fontFamily"]>) {
      state.fontFamily = action.payload;
    },
    setFontStyle(state, action: PayloadAction<TypographyState["fontStyle"]>) {
      state.fontStyle = action.payload;
    },
    setTextShadow(state, action: PayloadAction<TypographyState["textShadow"]>) {
      state.textShadow = action.payload;
    },
    setTranslationAlignment(
      state,
      action: PayloadAction<{
        type: "vertical" | "horizontal";
        target: "left" | "center" | "right";
      }>
    ) {
      if (action.payload.type == "vertical") {
        state.translationAlignment = {
          ...state.translationAlignment,
          textVertical:
            action.payload.target == "left"
              ? "left"
              : action.payload.target == "center"
              ? "center"
              : "right",
          viewVertical:
            action.payload.target == "left"
              ? "flex-start"
              : action.payload.target == "center"
              ? "center"
              : "flex-end",
        };
      }
      if (action.payload.type == "horizontal") {
        state.translationAlignment = {
          ...state.translationAlignment,
          textHorizontal:
            action.payload.target == "left"
              ? "left"
              : action.payload.target == "center"
              ? "center"
              : "right",
          viewHorizontal:
            action.payload.target == "left"
              ? "flex-start"
              : action.payload.target == "center"
              ? "center"
              : "flex-end",
        };
      }
    },
  },
});

export const {
  setBackgroundColor,
  setFontColor,
  setFontSize,
  setFontFamily,
  setFontStyle,
  setTextShadow,
  setTranslationAlignment,
} = typographySlice.actions;

export default typographySlice.reducer;
