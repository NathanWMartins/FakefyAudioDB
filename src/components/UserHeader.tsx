import { AppBar, Toolbar, Box, Button } from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../app/store";
import { logout } from "../redux/userSlice";

export default function Header() {
    const dispatch = useDispatch<AppDispatch>();
    const nav = useNavigate();

    function handleLogout() {
        dispatch(logout());
        nav("/");
    }

    return (
        <AppBar position="sticky" color="transparent" elevation={0}>
            <Toolbar sx={{ gap: 2, bgcolor: "background.paper" }}>
                <Box
                    component="img"
                    onClick={() => nav("/home/user")}
                    src="/fakefyLogo.png"
                    alt="Fakefy Logo"
                    sx={{ height: 50 }}
                />

                <Box sx={{ ml: "auto", display: "flex", gap: 1, alignItems: "center" }}>
                    <Button component={RouterLink} to="/playlists" variant="outlined" color="primary">
                        Playlists
                    </Button>
                    <Button component={RouterLink} to="/songs" variant="outlined" color="primary">
                        Songs
                    </Button>
                    <Button onClick={handleLogout} variant="contained" color="primary">
                        Logout
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
}
