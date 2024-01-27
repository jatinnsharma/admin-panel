import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { ContextProvider } from "./contexts/ContextProvider";
import { AuthProvider } from "./contexts/AuthContext";
import { BrowserRouter } from "react-router-dom";
// import ChatProvider from "./contexts/ChatProvider";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ContextProvider>
      <AuthProvider>
          <App />
      </AuthProvider>
    </ContextProvider>
  </BrowserRouter>
);
