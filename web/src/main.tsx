import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Router } from "./core/routers";
import { AuthProvider } from "./core/AuthProvider";
import { BrowserRouter } from "react-router";
import { AlertProvider } from "./core/AlertContext";

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
