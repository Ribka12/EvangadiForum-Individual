
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./i18n"; // Keep this if you have i18n.js

// REMOVE OR COMMENT OUT THIS LINE:
// import "./index.css"; // This file doesn't exist

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);