import { AppBar, Toolbar, Box, Button } from "@mui/material";
import { useState } from "react";
import LoginDialog from "./LoginDialog";

export default function Header() {
    const [open, setOpen] = useState(false);

    return (
        <>
            <AppBar position="sticky" color="transparent" elevation={0}>
                <Toolbar sx={{ gap: 2, mt: 1 }}>
                    <Box
                        component="img"
                        src="/fakefyLogo.png"
                        alt="Fakefy Logo"
                        sx={{ height: 50 }}
                    />

                    <Box sx={{ ml: "auto", display: "flex", gap: 1, alignItems: "center" }}>
                        <Button onClick={() => setOpen(true)} variant="contained" color="primary">
                            Login
                        </Button>
                    </Box>
                </Toolbar>
            </AppBar>
            <LoginDialog open={open} onClose={() => setOpen(false)} />
        </>
    );
}
