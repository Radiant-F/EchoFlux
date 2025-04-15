export const languages = [
  { code: "en", label: "English" },
  { code: "id", label: "Indonesian" },
  { code: "ja", label: "Japanese" },
  { code: "zh", label: "Chinese" },
  { code: "es", label: "Spanish" },
  { code: "fr", label: "French" },
  { code: "de", label: "German" },
  { code: "it", label: "Italian" },
  { code: "pt", label: "Portuguese" },
  { code: "ru", label: "Russian" },
] as const;
export type LanguageCode = (typeof languages)[number]["code"];

export const fontFamilies = [
  "Arial",
  "Courier New",
  "Times New Roman",
  "Verdana",
  "Roboto",
  "Georgia",
  "Tahoma",
  "Trebuchet MS",
  "Impact",
  "Comic Sans MS",
  "Lucida Console",
  "Custom",
] as const;
export type FontFamilyName = (typeof fontFamilies)[number];

import { createTheme } from "@mui/material/styles";
export const lightTheme = createTheme({
  palette: {
    mode: "light",
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});
