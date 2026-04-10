import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import { Router } from "./router";
import { AuthProvider } from "./providers/AuthProvider";
import { BrowserRouter } from "react-router";
import { AlertProvider } from "./providers/AlertContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AlertProvider>
        <AuthProvider>
          <Router />
        </AuthProvider>
      </AlertProvider>
    </BrowserRouter>
  </StrictMode>,
);
