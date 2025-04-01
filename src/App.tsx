import { Container, Typography } from "@mui/material";
import { TranslatorController } from "./components/TranslatorController";
import { Translation } from "./components/Translation";
import { Customization } from "./components/Customization";

export default function App() {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Echo Flux - Seamless Live Translator
      </Typography>

      {/* Languages & Mic toggle */}
      <TranslatorController />

      {/* Styling Controls */}
      <Customization />

      {/* Translation Display */}
      <Translation />
    </Container>
  );
}
