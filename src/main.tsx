import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./app/store";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import "./index.css";
import Route from "./routes/Route";
import Home from "./pages/Home";
import Playlists from "./pages/Playlists";
import Songs from "./pages/Songs";
import { darkTheme, lightTheme } from "./theme/theme";
import ThemeToggleFab from "./components/ThemeToggleFab";
import UserHome from "./pages/UserHome";
import PlaylistDetails from "./pages/PlaylistDetails";

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/home", element: <Home /> },

  {
    element: <Route />,
    children: [
      { path: "/home/user", element: <UserHome /> },
      { path: "/playlists", element: <Playlists /> },
      { path: "/playlists/:id", element: <PlaylistDetails /> },
      { path: "/songs", element: <Songs /> },
    ],
  },
]);

function Root() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <Provider store={store}>
      <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
        <CssBaseline />
        <RouterProvider router={router} />
        <ThemeToggleFab
          darkMode={darkMode}
          onToggle={() => setDarkMode((prev) => !prev)}
        />
      </ThemeProvider>
    </Provider>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Root />
  </StrictMode>
);