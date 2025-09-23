import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { PrimeReactProvider } from "primereact/api";
import App from "./views/App.tsx";
import "./views/styles/index.css";
import "primereact/resources/themes/lara-light-green/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { BrowserRouter } from "react-router-dom";
import { MainProvider } from "./views/contexts/mainContext.tsx";

createRoot(document.getElementById("root")!).render(
  <PrimeReactProvider>
    <MainProvider>
      <StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </StrictMode>
    </MainProvider>
  </PrimeReactProvider>,
);
