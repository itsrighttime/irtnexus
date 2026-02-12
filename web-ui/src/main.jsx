import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
// import "core-ui/dist/core-ui.css";
import "@itsrighttime/ui-components/dist/ui-components.css";
import { Trial } from "./Trail.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
    {/* <Trial /> */}
  </StrictMode>,
);
