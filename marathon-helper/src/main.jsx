import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { RaceProvider } from "./context/RaceProvider.jsx";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <BrowserRouter>
            <RaceProvider>
                <App />
            </RaceProvider>
        </BrowserRouter>
    </StrictMode>
);
