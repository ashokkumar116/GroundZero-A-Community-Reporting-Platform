import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import Navbar from "./Components/global/Navbar.jsx";
import { BrowserRouter } from "react-router-dom";
import Footer from "./Components/global/Footer.jsx";
import "primereact/resources/themes/lara-light-cyan/theme.css";



import { createTheme, ThemeProvider } from "@mui/material/styles";


import { PrimeReactProvider, PrimeReactContext } from 'primereact/api';

const theme = createTheme({
    typography: {
        fontFamily: '"Poppins", "sans-serif"',
    },
});

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <BrowserRouter>
            <PrimeReactProvider>
                <ThemeProvider theme={theme}>
                <Navbar />
                <App />
                <Footer />
            </ThemeProvider>
            </PrimeReactProvider>
        </BrowserRouter>
    </StrictMode>
);
