import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import Navbar from "./Components/global/Navbar.jsx";
import { BrowserRouter } from "react-router-dom";
import Footer from "./Components/global/Footer.jsx";
import "primereact/resources/themes/lara-light-green/theme.css";
import 'primeicons/primeicons.css';
import { createTheme, ThemeProvider } from "@mui/material/styles";
// import "react-country-state-city/dist/react-country-state-city.css";


import { PrimeReactProvider, PrimeReactContext } from 'primereact/api';
import { Toaster } from "react-hot-toast";
import ScrollToTop from "./utils/ScrollToTop.js";
const theme = createTheme({
    typography: {
        fontFamily: '"Poppins", "sans-serif"',
    },
});


createRoot(document.getElementById("root")).render(
    <StrictMode>
        <BrowserRouter>
            <ScrollToTop />
            <PrimeReactProvider>
                <ThemeProvider theme={theme}>
                <Navbar />
                <Toaster position="top-center" />
                <App />
                <Footer />
            </ThemeProvider>
            </PrimeReactProvider>
        </BrowserRouter>
    </StrictMode>
);
