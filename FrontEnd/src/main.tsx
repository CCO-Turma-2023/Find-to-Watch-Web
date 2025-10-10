// Seu arquivo de entrada (main.tsx ou index.tsx)

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { PrimeReactProvider } from "primereact/api";
import "./app/styles/globalStyle.css";
import "primereact/resources/themes/lara-light-green/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import { ToastProvider } from "./app/contexts/toastContext.tsx";
import { GoogleOAuthProvider } from '@react-oauth/google';

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

createRoot(document.getElementById("root")!).render(
  <PrimeReactProvider>
      <ToastProvider> 
        <StrictMode>
          <GoogleOAuthProvider clientId={googleClientId}>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </GoogleOAuthProvider>
        </StrictMode>
      </ToastProvider>
  </PrimeReactProvider>,
);