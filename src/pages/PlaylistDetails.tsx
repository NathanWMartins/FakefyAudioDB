import React, { useEffect, useMemo, useState } from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemButton,
    ListItemSecondaryAction,
    ListItemText,
    Stack,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";
import MusicNoteRoundedIcon from "@mui/icons-material/MusicNoteRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import ArrowUpwardRoundedIcon from "@mui/icons-material/ArrowUpwardRounded";
import ArrowDownwardRoundedIcon from "@mui/icons-material/ArrowDownwardRounded";
import PlaylistAddRoundedIcon from "@mui/icons-material/PlaylistAddRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import UserHeader from "../components/UserHeader";
import {
    selectPlaylistById,
    updatePlaylistName,
    removePlaylist,
    removeTrackFromPlaylist,
    reorderTracks,
    addPlaylist,
    type Track,
} from "../redux/playlistSlice";
import type { RootState } from "../app/store";

// componente de diálogo que já criamos
import TrackDetailsDialog, { type TrackDetails } from "../components/TrackDetailsDialog";

const fmtDate = (ms?: number) => (ms ? new Date(ms).toLocaleString() : "");

const PlaylistDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const playlist = useSelector((s: RootState) => selectPlaylistById(id!)(s));
    const user = useSelector((s: RootState) => s.user);

    // rename playlist
    const [openRename, setOpenRename] = useState(false);
    const [nome, setNome] = useState("");

    // criar playlist quando não existir
    const [openCreate, setOpenCreate] = useState(false);
    const [novoNome, setNovoNome] = useState("");

    // dialog de detalhes da faixa
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [detailsTrack, setDetailsTrack] = useState<TrackDetails | null>(null);

    useEffect(() => {
        sessionStorage.setItem("last_section", "playlist_details");
        if (playlist) setNome(playlist.nome);
    }, [playlist]);

    const tracks = useMemo(() => playlist?.musicas ?? [], [playlist]);

    const onRename = () => {
        if (!id || !nome.trim()) return;
        dispatch(updatePlaylistName({ id, nome: nome.trim() }));
        setOpenRename(false);
    };

    const onDelete = () => {
        if (!id || !playlist) return;
        const ok = window.confirm(
            `Delete playlist "${playlist.nome}"? This action cannot be undone.`
        );
        if (ok) {
            dispatch(removePlaylist({ id }));
            navigate("/playlists");
        }
    };

    const removeTrack = (trackId: string) => {
        if (!id) return;
        dispatch(removeTrackFromPlaylist({ playlistId: id, trackId }));
    };

    const move = (index: number, dir: -1 | 1) => {
        if (!id || !playlist) return;
        const to = index + dir;
        dispatch(reorderTracks({ playlistId: id, from: index, to }));
    };

    const goToAddFromSongs = () => {
        navigate({ pathname: "/songs", search: `?playlistId=${id}` });
    };

    // abrir detalhes de uma track
    const openDetailsFromTrack = (t: TrackDetails) => {
        setDetailsTrack({
            id: t.id,
            name: t.name,
            artist: t.artist,
            genre: t.genre,
            year: t.year,
            album: t.album,
            style: t.style,
            mood: t.mood,
            theme: t.theme,
            thumb: t.thumb,
            videoUrl: t.videoUrl,
            stats: t.stats,        
        });
        setDetailsOpen(true);
    };
    const closeDetails = () => {
        setDetailsOpen(false);
        setDetailsTrack(null);
    };

    // se não existe a playlist
    if (!playlist) {
        return (
            <Container sx={{ py: 6 }}>
                <Stack spacing={2} alignItems="flex-start">
                    <Button startIcon={<ArrowBackRoundedIcon />} onClick={() => navigate(-1)}>
                        Back
                    </Button>
                    <Typography variant="h6">Playlist not found.</Typography>
                    <Typography variant="body2" color="text.secondary">
                        You don't have a playlist yet. Create your first one to start adding songs.
                    </Typography>
                    <Button
                        variant="contained"
                        color="warning"
                        startIcon={<PlaylistAddRoundedIcon />}
                        onClick={() => setOpenCreate(true)}
                    >
                        Create your first playlist
                    </Button>
                </Stack>

                <Dialog open={openCreate} onClose={() => setOpenCreate(false)} fullWidth maxWidth="sm">
                    <DialogTitle>New playlist</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Name"
                            fullWidth
                            value={novoNome}
                            onChange={(e) => setNovoNome(e.target.value)}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenCreate(false)}>Cancel</Button>
                        <Button
                            variant="contained"
                            color="warning"
                            onClick={() => {
                                const idNew = crypto.randomUUID();
                                if (!novoNome.trim() || !user.session?.userId) return;
                                dispatch(
                                    addPlaylist({
                                        id: idNew,
                                        nome: novoNome.trim(),
                                        usuarioId: String(user.session.userId),
                                    })
                                );
                                setOpenCreate(false);
                                navigate(`/playlists/${idNew}`);
                            }}
                        >
                            Create
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        );
    }

    return (
        <Box>
            <UserHeader />

            <Container maxWidth="lg" sx={{ pb: 8 }}>
                <Card
                    sx={{
                        mt: 3,
                        mb: 1,
                        background: (t) => (t.palette.mode === "dark" ? "#1b1b1b" : "#fff"),
                    }}
                >
                    <Typography variant="h5" fontWeight="bold" sx={{ p: 3 }}>
                        {playlist.nome}
                    </Typography>
                </Card>

                <Card
                    sx={{ mb: 3, background: (t) => (t.palette.mode === "dark" ? "#1b1b1b" : "#fff") }}
                >
                    <CardContent>
                        <Stack
                            direction={{ xs: "column", sm: "row" }}
                            spacing={2}
                            alignItems={{ xs: "flex-start", sm: "center" }}
                            justifyContent="space-between"
                        >
                            <Stack direction="row" spacing={1} alignItems="center">
                                <Chip label={`${tracks.length} songs`} />
                                <Chip variant="outlined" label={`Created: ${fmtDate(playlist.createdAt)}`} />
                                {playlist.updatedAt && (
                                    <Chip variant="outlined" label={`Updated: ${fmtDate(playlist.updatedAt)}`} />
                                )}
                            </Stack>
                            <Stack direction="row" spacing={1}>
                                <Button
                                    variant="contained"
                                    color="warning"
                                    startIcon={<PlaylistAddRoundedIcon />}
                                    onClick={goToAddFromSongs}
                                >
                                    Add Songs
                                </Button>
                                <Button
                                    variant="outlined"
                                    startIcon={<EditRoundedIcon />}
                                    onClick={() => setOpenRename(true)}
                                >
                                    Rename
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    startIcon={<DeleteRoundedIcon />}
                                    onClick={onDelete}
                                >
                                    Delete
                                </Button>
                            </Stack>
                        </Stack>
                    </CardContent>
                </Card>

                <Card sx={{ background: (t) => (t.palette.mode === "dark" ? "#1b1b1b" : "#fff") }}>
                    <CardContent>
                        {tracks.length === 0 ? (
                            <Stack spacing={1} alignItems="center" textAlign="center" sx={{ py: 6 }}>
                                <MusicNoteRoundedIcon />
                                <Typography variant="h6">No tracks here yet</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Use "Add from Songs" to search and add tracks.
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="warning"
                                    startIcon={<PlaylistAddRoundedIcon />}
                                    onClick={goToAddFromSongs}
                                >
                                    Add from Songs
                                </Button>
                            </Stack>
                        ) : (
                            <List>
                                {tracks.map((t: Track, idx: number) => (
                                    <React.Fragment key={t.id}>
                                        <ListItem>
                                            {/* Clicável */}
                                            <ListItemButton onClick={() => openDetailsFromTrack(t)}>
                                                <ListItemAvatar>
                                                    <MusicNoteRoundedIcon />
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={`${t.name} — ${t.artist}`}
                                                    secondary={[t.genre ?? "", t.year ?? ""]
                                                        .filter(Boolean)
                                                        .join(" · ")}
                                                />
                                            </ListItemButton>

                                            <ListItemSecondaryAction>
                                                <Tooltip title="Move up">
                                                    <span>
                                                        <IconButton
                                                            edge="end"
                                                            disabled={idx === 0}
                                                            onClick={() => move(idx, -1)}
                                                        >
                                                            <ArrowUpwardRoundedIcon />
                                                        </IconButton>
                                                    </span>
                                                </Tooltip>
                                                <Tooltip title="Move down">
                                                    <span>
                                                        <IconButton
                                                            edge="end"
                                                            disabled={idx === tracks.length - 1}
                                                            onClick={() => move(idx, 1)}
                                                        >
                                                            <ArrowDownwardRoundedIcon />
                                                        </IconButton>
                                                    </span>
                                                </Tooltip>
                                                <Tooltip title="Remove from playlist">
                                                    <IconButton edge="end" onClick={() => removeTrack(t.id)}>
                                                        <DeleteRoundedIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                        {idx < tracks.length - 1 && <Divider component="li" />}
                                    </React.Fragment>
                                ))}
                            </List>
                        )}
                    </CardContent>
                </Card>
            </Container>

            {/* Rename dialog */}
            <Dialog open={openRename} onClose={() => setOpenRename(false)} fullWidth maxWidth="sm">
                <DialogTitle>Rename playlist</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        autoFocus
                        margin="dense"
                        label="Name"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenRename(false)}>Cancel</Button>
                    <Button variant="contained" color="warning" onClick={onRename}>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog de detalhes da faixa */}
            <TrackDetailsDialog open={detailsOpen} track={detailsTrack} onClose={closeDetails} />
        </Box>
    );
};

export default PlaylistDetails;
