import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

const savedTheme = localStorage.getItem("codearena-theme");

if (savedTheme) {
  document.documentElement.dataset.theme = savedTheme;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
