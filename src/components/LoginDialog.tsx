import { useState } from "react";
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Typography, TextField, Button, IconButton, Stack, Alert
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../app/store";
import { login } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";

type Props = {
    open: boolean;
    onClose: () => void;
};

export default function LoginDialog({ open, onClose }: Props) {
    const dispatch = useDispatch<AppDispatch>();
    const nav = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<string | null>(null);

    const emailValid = /^\S+@\S+\.\S+$/.test(email);
    const passValid = password.length >= 6;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setErr(null);

        if (!emailValid) { setErr("Invalid email"); return; }
        if (!passValid) { setErr("Password must have at least 6 characters"); return; }

        setLoading(true);
        try {
            dispatch(login({ email, senha: password }));
            onClose();
            nav("/home/user"); // ou /home, como preferir
        } catch (ex: any) {
            setErr(ex?.message ?? "Authentication failed");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog
            open={open}
            onClose={onClose}
            PaperProps={{ sx: { borderRadius: 3, p: 2, maxWidth: 420, width: "100%" } }}
        >
            <DialogTitle sx={{ m: 0, p: 2 }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                        Welcome back 👋
                    </Typography>
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Stack>
            </DialogTitle>

            <form onSubmit={handleSubmit}>
                <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1, pb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                        Log in to keep building your playlists with <b>Fakefy</b>.
                    </Typography>

                    {err && <Alert severity="error">{err}</Alert>}

                    <TextField
                        label="Email"
                        type="email"
                        fullWidth
                        required
                        autoFocus
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        error={!!err && !emailValid}
                    />

                    <TextField
                        label="Password"
                        type="password"
                        fullWidth
                        required
                        inputProps={{ minLength: 6 }}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        error={!!err && !passValid}
                    />
                </DialogContent>

                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={onClose} disabled={loading}>Cancel</Button>
                    <Button type="submit" variant="contained" color="primary" sx={{ px: 4, fontWeight: 600 }} disabled={loading}>
                        {loading ? "Entering..." : "Enter"}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
