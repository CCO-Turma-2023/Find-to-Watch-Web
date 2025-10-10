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

createRoot(document.getElementById("root")!).render(
  <PrimeReactProvider>
      <ToastProvider> 
        <StrictMode>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </StrictMode>
      </ToastProvider>
  </PrimeReactProvider>,
);