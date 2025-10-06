import { createTheme } from "@mui/material/styles";
import { yellow, grey } from "@mui/material/colors";

export const lightTheme = createTheme({
    palette: {
        mode: "light",
        primary: { main: yellow[800] },
        secondary: { main: grey[800] },
        background: { default: "#fffdf2", paper: "#ffffff" },
    },
    typography: {
        fontFamily: ["Inter", "Roboto", "Helvetica", "Arial", "sans-serif"].join(","),
        h3: { fontWeight: 800, letterSpacing: -0.5 },
    },
    shape: { borderRadius: 12 },
});

export const darkTheme = createTheme({
    palette: {
        mode: "dark",
        primary: { main: yellow[800] },
        secondary: { main: grey[500] },
        background: { default: "#121212", paper: "#1e1e1e" },
    },
    typography: {
        fontFamily: ["Inter", "Roboto", "Helvetica", "Arial", "sans-serif"].join(","),
        h3: { fontWeight: 800, letterSpacing: -0.5 },
    },
    shape: { borderRadius: 12 },
});
