import { Box, Button, Typography } from "@mui/material";
import { useAppSelector } from "../hooks";
import { useEffect, useRef } from "react";
import { OpenInNew } from "@mui/icons-material";

export function Translation() {
  const {
    backgroundColor,
    fontColor,
    fontSize,
    fontFamily,
    textShadow,
    translationAlignment,
  } = useAppSelector((state) => state.typography);
  const { translation } = useAppSelector((state) => state.translation);

  const popupRef = useRef<Window | null>(null);
  const popOutWindow = () => {
    const popup = window.open("", "TranslationPopup", "width=600,height=200");
    if (popup) {
      popup.document.writeln(`
<html>
  <head>
    <title>Translation Overlay</title>
    <style>
      @font-face {
        font-family: ${fontFamily.name};
        src: url("${fontFamily.url}");
      }
      body {
        margin: 0;
        background-color: ${backgroundColor};
        display: flex;
        height: 100vh;
        overflow: hidden;
      }
      #translation {
        font-family: ${fontFamily.name};
        color: ${fontColor};
        font-size: ${fontSize}px;
        text-shadow: ${
          textShadow.enabled
            ? `${textShadow.shadowX}px ${textShadow.shadowY}px ${textShadow.shadowBlur}px ${textShadow.shadowColor}`
            : "none"
        };
        text-align: ${translationAlignment.textHorizontal};
        margin: 15;
      }
      #container {
        width: 100%;
        height: 100%;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        justify-content: ${translationAlignment.viewVertical};
        align-items: ${translationAlignment.viewHorizontal};
        scrollbar-width: none; /* Hide scrollbar for Firefox */
        -ms-overflow-style: none; /* Hide scrollbar for IE/Edge */
      }
      #container::-webkit-scrollbar {
        display: none; /* Hide scrollbar for Chrome, Safari, Edge */
      }
    </style>
  </head>
  <body>
    <div id="container">
      <div id="translation">${translation}</div>
    </div>
    <script>
      function scrollToBottom() {
        var container = document.getElementById("container");
        container.scrollTop = container.scrollHeight;
      }

      window.addEventListener("message", (event) => {
        if (event.data.type === "updateTranslation") {
          document.getElementById("translation").innerText = event.data.text;
          scrollToBottom(); // Scroll to bottom when text updates
        }
      });

      scrollToBottom(); // Ensure initial scroll
    </script>
  </body>
</html>
        `);
      popup.document.close();
      popupRef.current = popup;
    }
  };

  useEffect(() => {
    if (popupRef.current) {
      popupRef.current.postMessage(
        { type: "updateTranslation", text: translation },
        "*"
      );
    }
  }, [translation]);

  return (
    <>
      <Typography variant="h6" my={1}>
        Translation:
      </Typography>
      <Button
        variant="contained"
        startIcon={<OpenInNew />}
        onClick={popOutWindow}
        sx={{ mb: 2 }}
      >
        Pop Out Translation
      </Button>
      <Box
        display={"flex"}
        minHeight={150}
        boxShadow={2}
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
    </>
  );
}
