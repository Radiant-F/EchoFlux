import { Box, Card, Typography } from "@mui/material";
import { useAppSelector } from "../hooks";

export default function Translation() {
  const {
    backgroundColor,
    fontColor,
    fontSize,
    fontFamily,
    textShadow,
    translationAlignment,
  } = useAppSelector((state) => state.typography);
  const { translation } = useAppSelector((state) => state.translation);

  return (
    <Box mb={5}>
      <Typography variant="h5" gutterBottom>
        Translation
      </Typography>
      <Card sx={{ borderRadius: 5 }}>
        <Box
          display={"flex"}
          minHeight={150}
          sx={{ backgroundColor }}
          justifyContent={translationAlignment.viewHorizontal}
          alignItems={translationAlignment.viewVertical}
        >
          <Typography
            color={fontColor}
            fontSize={fontSize}
            fontFamily={fontFamily.name}
            margin={2}
            textAlign={translationAlignment.textHorizontal as any}
            sx={{
              textShadow: textShadow.enabled
                ? `${textShadow.shadowX}px ${textShadow.shadowY}px ${textShadow.shadowBlur}px ${textShadow.shadowColor}`
                : "",
            }}
          >
            {translation}
          </Typography>
        </Box>
      </Card>
    </Box>
  );
}
