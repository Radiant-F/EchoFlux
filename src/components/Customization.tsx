import {
  Button,
  Collapse,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  styled,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  setBackgroundColor,
  setFontColor,
  setFontFamily,
  setFontSize,
  setTranslationAlignment,
  setTextShadow,
} from "../redux/slice/typographySlice";
import { FontFamilyName } from "../constant";
import { FileUpload } from "@mui/icons-material";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export function Customization() {
  const {
    backgroundColor,
    fontColor,
    fontSize,
    fontFamily,
    fontFamilyList,
    textShadow,
    translationAlignment,
  } = useAppSelector((state) => state.typography);
  const dispatch = useAppDispatch();

  const handleFontUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const fontUrl = URL.createObjectURL(file);
      const fontName = file.name.replace(/\.[^/.]+$/, ""); // Remove file extension

      try {
        const newFontFace = new FontFace(fontName, `url(${fontUrl})`);
        await newFontFace.load();
        document.fonts.add(newFontFace);
        dispatch(
          setFontFamily({ name: fontName as FontFamilyName, url: fontUrl })
        );
      } catch (error) {
        console.error("Error loading font:", error);
      }
    }
  };

  return (
    <>
      <Typography variant="h6" my={2.5}>
        Customize Appearance:
      </Typography>

      {/* Background color, font color and font size */}
      <Stack spacing={2} mb={2} direction="row" alignItems="center">
        <TextField
          type="color"
          label="Background Color"
          value={backgroundColor}
          onChange={(e) => dispatch(setBackgroundColor(e.target.value))}
          sx={{ width: 150 }}
        />
        <TextField
          type="color"
          label="Font Color"
          value={fontColor}
          onChange={(e) => dispatch(setFontColor(e.target.value))}
          sx={{ width: 150 }}
        />
        <TextField
          type="number"
          label="Font Size"
          value={fontSize}
          onChange={(e) => dispatch(setFontSize(Number(e.target.value)))}
          sx={{ width: 150 }}
        />
      </Stack>

      {/* Translation text alignment */}
      <Stack direction="row" spacing={2} mb={2} alignItems="center">
        <FormControl sx={{ width: 150 }}>
          <InputLabel>Align Horizontal</InputLabel>
          <Select
            label="Align Horizontal"
            value={translationAlignment.textHorizontal}
            onChange={(e) => {
              dispatch(
                setTranslationAlignment({
                  target: e.target.value as any,
                  type: "horizontal",
                })
              );
            }}
          >
            <MenuItem value={"left"}>Left</MenuItem>
            <MenuItem value={"center"}>Center</MenuItem>
            <MenuItem value={"right"}>Right</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ width: 150 }}>
          <InputLabel>Align Vertical</InputLabel>
          <Select
            label="Align Vertical"
            value={translationAlignment.textVertical}
            onChange={(e) => {
              dispatch(
                setTranslationAlignment({
                  target: e.target.value as any,
                  type: "vertical",
                })
              );
            }}
          >
            <MenuItem value="left">Top</MenuItem>
            <MenuItem value="center">Center</MenuItem>
            <MenuItem value="right">Bottom</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      {/* Font family and text decoration */}
      <Stack spacing={2} mb={2} direction="row" alignItems="center">
        <FormControl sx={{ width: 150 }}>
          <InputLabel>Font Family</InputLabel>
          <Select
            value={fontFamily.url ? "Custom" : fontFamily.name}
            onChange={(e) => {
              dispatch(
                setFontFamily({
                  name: e.target.value as FontFamilyName,
                  url: "",
                })
              );
            }}
            label="Font Family"
          >
            {fontFamilyList.map((font) => (
              <MenuItem key={font} value={font}>
                {font}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          variant="contained"
          size="large"
          startIcon={<FileUpload />}
          component="label"
        >
          Use Custom Font
          <VisuallyHiddenInput
            accept=".ttf, .woff, .woff2"
            type="file"
            onChange={handleFontUpload}
          />
        </Button>
      </Stack>

      {/* Text shadow */}
      <FormControlLabel
        control={
          <Switch
            defaultChecked={textShadow.enabled}
            value={textShadow.enabled}
          />
        }
        label="Enable Text Shadow"
        onChange={() => {
          dispatch(
            setTextShadow({ ...textShadow, enabled: !textShadow.enabled })
          );
        }}
      />
      <Collapse in={textShadow.enabled}>
        <Stack my={2} direction="row" spacing={2} alignItems="center">
          <TextField
            type="color"
            label="Shadow Color"
            value={textShadow.shadowColor}
            onChange={(e) => {
              dispatch(
                setTextShadow({ ...textShadow, shadowColor: e.target.value })
              );
            }}
            sx={{ width: "150px" }}
          />
          <TextField
            type="number"
            label="X Offset"
            value={textShadow.shadowX}
            onChange={(e) => {
              dispatch(
                setTextShadow({ ...textShadow, shadowX: e.target.value })
              );
            }}
            sx={{ width: 150 }}
          />
          <TextField
            type="number"
            label="Y Offset"
            value={textShadow.shadowY}
            onChange={(e) => {
              dispatch(
                setTextShadow({ ...textShadow, shadowY: e.target.value })
              );
            }}
            sx={{ width: 150 }}
          />
          <TextField
            type="number"
            label="Blur"
            value={textShadow.shadowBlur}
            onChange={(e) => {
              dispatch(
                setTextShadow({ ...textShadow, shadowBlur: e.target.value })
              );
            }}
            sx={{ width: 150 }}
          />
        </Stack>
      </Collapse>
    </>
  );
}
