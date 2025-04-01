import { Button, MenuItem, Select, Stack, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  setListening,
  setTranslateSource,
  setTranslateTarget,
  setTranslation,
} from "../redux/slice/translationSlice";
import { LanguageCode } from "../constant";
import { Mic, MicOff } from "@mui/icons-material";
import { useRef } from "react";

export function TranslatorController() {
  const { languages, translate, listening } = useAppSelector(
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

  const translateTextDeepl = async (text: string) => {
    try {
      const res = await fetch("http://localhost:5000/translate/deepl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          target_lang: translate.target,
          source_lang: translate.source,
        }),
      });

      const data = await res.json();
      dispatch(setTranslation(data.translations[0]?.text || ""));
    } catch (error) {
      console.error("Translation error:", error);
    }
  };

  const translateTextLibre = async (text: string) => {
    try {
      const res = await fetch("http://localhost:5000/translate/libre", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          target_lang: translate.target,
          source_lang: translate.source,
        }),
      });

      const data = await res.json();
      dispatch(setTranslation(data.translatedText || ""));
    } catch (error) {
      console.error("Translation error:", error);
    }
  };

  return (
    <>
      {/* Language Selector */}
      <Stack direction="row" spacing={2} mb={2} alignItems={"center"}>
        <Typography>Speech Language: </Typography>
        <Select
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
      <Stack direction="row" spacing={2} mb={2} alignItems={"center"}>
        <Typography>Translate To: </Typography>
        <Select
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

      {/* Listening Control */}
      <Button
        variant="contained"
        color={listening ? "secondary" : "primary"}
        onClick={() => {
          dispatch(setListening(!listening));
          if (listening) {
            stopListening();
          } else {
            startListening();
          }
        }}
        startIcon={listening ? <MicOff /> : <Mic />}
      >
        {listening ? "Stop" : "Start"} Listening
      </Button>
    </>
  );
}
