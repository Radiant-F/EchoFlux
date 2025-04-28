import { useEffect, useRef } from "react";
import { useAppSelector, useAppDispatch } from "../hooks";
import { setListening, setTranslation } from "../redux/slice/translationSlice";
import { MicOff, Mic, OpenInNew } from "@mui/icons-material";
import { Box, Button, Card, Stack, Tooltip, Typography } from "@mui/material";

export default function Control() {
  // Speech recognition
  const { translate, listening, translation } = useAppSelector(
    (state) => state.translation
  );
  const dispatch = useAppDispatch();

  const SpeechRecognition =
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition;
  const recognitionRef = useRef<typeof SpeechRecognition>(
    new SpeechRecognition()
  );
  const recognition = recognitionRef.current;

  recognition.lang = translate.source;
  recognition.continuous = true;
  recognition.interimResults = true;

  let currentPhrase: string = "";
  let silenceTimer: ReturnType<typeof setTimeout> | null = null;
  const SILENCE_DELAY: number = 500; // ms

  recognition.onresult = (event: any) => {
    let interimTranscript = "";

    for (let i = event.resultIndex; i < event.results.length; ++i) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        currentPhrase += transcript;
      } else {
        interimTranscript += transcript;
      }
    }

    if (interimTranscript) {
      translateTextLibre(interimTranscript);
      console.log("Interim:", interimTranscript);
    }

    if (silenceTimer) clearTimeout(silenceTimer);
    silenceTimer = setTimeout(() => {
      if (currentPhrase.trim()) {
        console.log("Translating current phrase:", currentPhrase);
        translateTextLibre(currentPhrase);
        currentPhrase = "";
      }
    }, SILENCE_DELAY);
  };

  recognition.onend = () => {
    if (listening) {
      console.log("Speech recognition ended, restarting...");
      recognition.lang = translate.source;
      recognition.start();
    } else {
      console.log("Stopped listening.");
    }
  };

  const startListening = () => {
    recognition.lang = translate.source;
    recognition.start();
    dispatch(setListening(true));
    console.log("Listening started...");
  };

  const stopListening = () => {
    recognition.stop();
    dispatch(setListening(false));
    console.log("Stopping listening...");
  };

  const translateTextLibre = async (text: string) => {
    try {
      const res = await fetch("http://127.0.0.1:5000/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          q: text,
          source: translate.source,
          target: translate.target,
        }),
      });

      const data = await res.json();
      dispatch(setTranslation(data.translatedText || ""));
    } catch (error) {
      console.error("Translation error:", error);
    }
  };

  // Popup translation window
  const {
    backgroundColor,
    fontColor,
    fontSize,
    fontFamily,
    textShadow,
    translationAlignment,
  } = useAppSelector((state) => state.typography);

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
    <Box>
      <Typography variant="h5" gutterBottom>
        Control
      </Typography>

      <Card sx={{ borderRadius: 5, padding: 5 }}>
        <Stack spacing={2}>
          <Button
            variant="contained"
            color={listening ? "secondary" : "primary"}
            onClick={() => {
              dispatch(setListening(!listening));
              if (listening) stopListening();
              else startListening();
            }}
            startIcon={listening ? <MicOff /> : <Mic />}
          >
            {listening ? "Stop" : "Start"} Listening
          </Button>

          <Tooltip
            title="Pop-out the translation window for better capture"
            enterDelay={1000}
            arrow
          >
            <Button
              variant="contained"
              startIcon={<OpenInNew />}
              onClick={popOutWindow}
            >
              Pop Out Translation
            </Button>
          </Tooltip>
        </Stack>
      </Card>
    </Box>
  );
}
