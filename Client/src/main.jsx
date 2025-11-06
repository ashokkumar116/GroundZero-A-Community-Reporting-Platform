import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import Navbar from "./Components/Navbar.jsx";
import { BrowserRouter } from "react-router-dom";
import Footer from "./Components/Footer.jsx";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <BrowserRouter>
            <Navbar />
            <App />
            <Footer />
        </BrowserRouter>
    </StrictMode>
);
