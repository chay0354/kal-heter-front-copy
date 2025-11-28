import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { V } from "./screens/V";

createRoot(document.getElementById("app")).render(
  <StrictMode>
    <V />
  </StrictMode>,
);
