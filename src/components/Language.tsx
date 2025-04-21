import {
  Box,
  Card,
  MenuItem,
  Select,
  Stack,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  setTranslateSource,
  setTranslateTarget,
} from "../redux/slice/translationSlice";
import { LanguageCode } from "../constant";
import Control from "./Control";

export default function Language() {
  const { languages, translate, listening } = useAppSelector(
    (state) => state.translation
  );
  const dispatch = useAppDispatch();

  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg"));

  return (
    <Box sx={{ flex: 1 }}>
      <Typography variant="h5" gutterBottom>
        Language
      </Typography>
      <Card sx={{ borderRadius: 5, mb: 2 }}>
        <Stack
          direction="row"
          mt={1}
          mb={1}
          mr={5}
          ml={5}
          spacing={2}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Typography>Speech Language</Typography>
          <Select
            sx={{ width: 150 }}
            value={translate.source}
            onChange={(e) =>
              dispatch(setTranslateSource(e.target.value as LanguageCode))
            }
            disabled={listening}
          >
            {languages.map((lang) => (
              <MenuItem key={lang.code} value={lang.code}>
                {lang.label}
              </MenuItem>
            ))}
          </Select>
        </Stack>
      </Card>
      <Card sx={{ borderRadius: 5, mb: isLargeScreen ? 5 : 0 }}>
        <Stack
          direction="row"
          mt={1}
          mb={1}
          mr={5}
          ml={5}
          spacing={2}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Typography>Translate To</Typography>
          <Select
            sx={{ width: 150 }}
            value={translate.target}
            onChange={(e) =>
              dispatch(setTranslateTarget(e.target.value as LanguageCode))
            }
            disabled={listening}
          >
            {languages.map((lang) => (
              <MenuItem key={lang.code} value={lang.code}>
                {lang.label}
              </MenuItem>
            ))}
          </Select>
        </Stack>
      </Card>

      {isLargeScreen && <Control />}
    </Box>
  );
}
