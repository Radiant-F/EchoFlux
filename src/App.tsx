import {
  Container,
  Stack,
  Typography,
  useTheme,
  useMediaQuery,
  ThemeProvider,
  CssBaseline,
} from "@mui/material";
import Language from "./components/Language";
import Translation from "./components/Translation";
import Apperance from "./components/Appearance";
import Control from "./components/Control";
import { lightTheme, darkTheme } from "./constant";
import { useMemo } from "react";
import { useAppSelector } from "./hooks";

export default function App() {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg"));
  const { theme_mode } = useAppSelector((state) => state.utils);

  const themeMode = useMemo(
    () => (theme_mode == "light" ? lightTheme : darkTheme),
    [theme_mode]
  );

  return (
    <ThemeProvider theme={themeMode}>
      <CssBaseline />
      <Container>
        <Typography mt={5} variant="h4" textAlign={"center"}>
          Echo Flux
        </Typography>
        <Typography mb={5} textAlign={"center"}>
          Seamless Live Translator
        </Typography>

        <Stack direction={isLargeScreen ? "row" : "column"} spacing={5} mb={5}>
          <Language />

          <Apperance />

          {!isLargeScreen && <Control />}
        </Stack>

        <Translation />
      </Container>
    </ThemeProvider>
  );
}
