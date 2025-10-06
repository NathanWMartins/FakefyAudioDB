import React from "react";
import {
    Box,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Stack,
    Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export type TrackDetails = {
    id: string;
    name: string;
    artist: string;
    album?: string;
    genre?: string;
    year?: string;
    style?: string;
    mood?: string;
    theme?: string;
    thumb?: string; // url da capa
    videoUrl?: string;
    stats?: {
        plays?: number | string;
        listeners?: number | string;
        views?: number | string;
        likes?: number | string;
        loved?: number | string;
    };
};

type Props = {
    open: boolean;
    track: TrackDetails | null;
    onClose: () => void;
};

const TrackDetailsDialog: React.FC<Props> = ({ open, track, onClose }) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="lg"
            fullWidth
            PaperProps={{ sx: { borderRadius: 3, p: 1, maxHeight: "90vh" } }}
        >
            {track && (
                <>
                    <DialogTitle sx={{ m: 0, p: 2 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                {track.name} — {track.artist}
                            </Typography>
                            <IconButton onClick={onClose}>
                                <CloseIcon />
                            </IconButton>
                        </Stack>
                    </DialogTitle>

                    <DialogContent dividers sx={{ overflow: "visible" }}>
                        <Stack
                            direction={{ xs: "column", sm: "row" }}
                            spacing={3}
                            alignItems={{ xs: "center", sm: "flex-start" }}
                        >
                            <Box sx={{ width: { xs: "100%", sm: 300 }, flexShrink: 0, textAlign: "center" }}>
                                {track.thumb ? (
                                    <Box
                                        component="img"
                                        src={track.thumb}
                                        alt={track.name}
                                        sx={{ width: "100%", borderRadius: 2, boxShadow: 3 }}
                                    />
                                ) : (
                                    <Box
                                        sx={{
                                            width: "100%",
                                            height: 300,
                                            borderRadius: 2,
                                            bgcolor: "action.hover",
                                            display: "grid",
                                            placeItems: "center",
                                            color: "text.secondary",
                                        }}
                                    >
                                        No cover
                                    </Box>
                                )}
                            </Box>

                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Stack spacing={1.25} sx={{ mb: 2 }}>
                                    <Typography variant="body2">
                                        <b>Album:</b> {track.album ?? "—"}
                                    </Typography>
                                    <Typography variant="body2">
                                        <b>Genre:</b> {track.genre ?? "—"}
                                    </Typography>
                                    <Typography variant="body2">
                                        <b>Year:</b> {track.year ?? "—"}
                                    </Typography>
                                    <Typography variant="body2">
                                        <b>Style:</b> {track.style ?? "—"}
                                    </Typography>
                                    <Typography variant="body2">
                                        <b>Mood:</b> {track.mood ?? "—"}
                                    </Typography>
                                    <Typography variant="body2">
                                        <b>Theme:</b> {track.theme ?? "—"}
                                    </Typography>
                                </Stack>

                                <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
                                    {track.stats?.plays && <Chip label={`${track.stats.plays} plays`} />}
                                    {track.stats?.listeners && <Chip label={`${track.stats.listeners} listeners`} />}
                                    {track.stats?.views && <Chip label={`${track.stats.views} views`} />}
                                    {track.stats?.likes && <Chip label={`${track.stats.likes} likes`} />}
                                    {track.stats?.loved && <Chip label={`${track.stats.loved} loved`} />}
                                </Stack>

                                {track.videoUrl && (
                                    <Box sx={{ mt: 2 }}>
                                        <Button
                                            href={track.videoUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            variant="outlined"
                                        >
                                            Watch Music Video
                                        </Button>
                                    </Box>
                                )}
                            </Box>
                        </Stack>
                    </DialogContent>

                    <DialogActions>
                        <Button onClick={onClose}>Close</Button>
                    </DialogActions>
                </>
            )}
        </Dialog>
    );
};

export default TrackDetailsDialog;
