import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../app/store";
import { Box, Container, Typography, Paper, Stack, Button, Chip } from "@mui/material";
import { setLastPlaylist } from "../redux/userSlice";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import Header from "../components/UserHeader";
import WavingHandIcon from "@mui/icons-material/WavingHand";

export default function UserHome() {
    const session = useSelector((s: RootState) => s.user.session);
    const playlists = useSelector((s: RootState) => (s.playlists as any).items ?? []);
    const dispatch = useDispatch<AppDispatch>();
    const nav = useNavigate();

    const userPlaylists = playlists
        .filter((p: any) => p.usuarioId === session?.userId)
        .sort((a: any, b: any) => (b.createdAt ?? 0) - (a.createdAt ?? 0));

    const recent = userPlaylists.slice(0, 5);

    function openPlaylist(pId: string) {
        dispatch(setLastPlaylist(pId));
        nav("/playlists");
    }

    return (
        <Box sx={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
            <Header />

            <Container maxWidth="md" sx={{ flex: 1, py: 4 }}>
                {/* Boas-vindas */}
                <Box sx={{ mb: 4, textAlign: "center" }}>
                    <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="center"
                        spacing={1}
                        sx={{ mb: 0.5 }}
                    >
                        <Typography variant="h4" sx={{ fontWeight: 800 }}>
                            Welcome, {session?.email?.split("@")[0] ?? "user"}
                        </Typography>
                        <WavingHandIcon color="inherit" sx={{ fontSize: 32 }} />
                    </Stack>

                    <Typography variant="body2" color="text.secondary">
                        Last login: {session ? new Date(session.lastLogin).toLocaleString() : "—"}
                    </Typography>
                </Box>

                {/* Playlists */}
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                    Your latest playlists
                </Typography>

                {recent.length === 0 ? (
                    <Paper sx={{ p: 3, textAlign: "center" }}>
                        <Typography>You don’t have any playlists yet.</Typography>
                        <Button
                            component={RouterLink}
                            to="/playlists"
                            variant="contained"
                            color="primary"
                            sx={{ mt: 2 }}
                        >
                            Create your first playlist
                        </Button>
                    </Paper>
                ) : (
                    <Stack spacing={2}>
                        {recent.map((pl: any) => (
                            <Paper key={pl.id} sx={{ p: 2, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <Box>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                                        {pl.nome}
                                    </Typography>
                                    <Chip
                                        size="small"
                                        label={`${pl.musicas?.length ?? 0} songs`}
                                        color="primary"
                                        variant="outlined"
                                        sx={{ mt: 0.5 }}
                                    />
                                </Box>
                                <Button onClick={() => openPlaylist(pl.id)} size="small">
                                    Open
                                </Button>
                            </Paper>
                        ))}
                    </Stack>
                )}
            </Container>
        </Box>
    );
}
