import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import LibraryMusicRoundedIcon from "@mui/icons-material/LibraryMusicRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import PlaylistPlayRoundedIcon from "@mui/icons-material/PlaylistPlayRounded";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import UserHeader from "../components/UserHeader";
import type { RootState } from "../app/store";
import {
  addPlaylist,
  updatePlaylistName,
  removePlaylist,
  reloadFromStorage,
  type Playlist,
} from "../redux/playlistSlice";

const Playlists: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userId = useSelector((s: RootState) => s.user.session?.userId);

  const allPlaylists = useSelector((s: RootState) => s.playlists.items);

  const myPlaylists = useMemo(
    () => allPlaylists.filter((p) => String(p.usuarioId) === String(userId ?? "")),
    [allPlaylists, userId]
  );

  const [query, setQuery] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState<Playlist | null>(null);
  const [nome, setNome] = useState("");
  const [lastId, setLastId] = useState<string | null>(
    sessionStorage.getItem("last_playlist_id")
  );


  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return myPlaylists;
    return myPlaylists.filter((p) => p.nome.toLowerCase().includes(q));
  }, [myPlaylists, query]);

  useEffect(() => {
    dispatch(reloadFromStorage());
    sessionStorage.setItem("last_section", "playlists");
  }, [dispatch]);

  useEffect(() => {
    const onFocus = () => setLastId(sessionStorage.getItem("last_playlist_id"));
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  const handleOpenCreate = () => {
    setEditing(null);
    setNome("");
    setOpenForm(true);
  };

  const handleOpenEdit = (pl: Playlist) => {
    setEditing(pl);
    setNome(pl.nome);
    setOpenForm(true);
  };

  const handleSave = () => {
    if (!nome.trim() || !userId) return;

    if (editing) {
      dispatch(updatePlaylistName({ id: editing.id, nome: nome.trim() }));
    } else {
      dispatch(
        addPlaylist({
          id: crypto.randomUUID(),
          nome: nome.trim(),
          usuarioId: String(userId),
        })
      );
    }
    setOpenForm(false);
  };

  const handleDelete = (pl: Playlist) => {
    if (window.confirm(`Delete playlist "${pl.nome}"? This action cannot be undone.`)) {
      dispatch(removePlaylist({ id: pl.id }));
    }
  };

  const openDetails = (pl: Playlist) => {
    sessionStorage.setItem("last_playlist_id", pl.id);
    navigate(`/playlists/${pl.id}`);
  };

  return (
    <Box>
      <UserHeader />

      <Container maxWidth="lg" sx={{ pb: 8 }}>
        {/* Barra de ações */}
        <Toolbar disableGutters sx={{ mt: 2, mb: 3, gap: 2, justifyContent: "space-between" }}>
          <TextField
            size="medium"
            variant="outlined"
            placeholder="Search playlists"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
            sx={{ maxWidth: 420, width: "100%" }}
          />

          <Button
            onClick={handleOpenCreate}
            variant="contained"
            color="warning"
            startIcon={<AddRoundedIcon />}
          >
            New playlist
          </Button>
        </Toolbar>

        {/* Estado vazio */}
        {filtered.length === 0 ? (
          <Card
            sx={{
              p: 4,
              background: (t) => (t.palette.mode === "dark" ? "#212121" : "#fafafa"),
              border: (t) => `1px solid ${t.palette.divider}`,
            }}
          >
            <CardContent>
              <Stack spacing={1.5} alignItems="center" textAlign="center">
                <PlaylistPlayRoundedIcon fontSize="large" />
                <Typography variant="h6">You don’t have any playlists yet</Typography>
                <Typography variant="body2" color="text.secondary">
                  Create your first playlist to start adding songs from the Songs page.
                </Typography>
                <Button
                  onClick={handleOpenCreate}
                  variant="contained"
                  color="warning"
                  startIcon={<AddRoundedIcon />}
                  sx={{ mt: 1 }}
                >
                  Create your first playlist
                </Button>
              </Stack>
            </CardContent>
          </Card>
        ) : (
          <>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              {filtered.length} playlist{filtered.length > 1 ? "s" : ""}
            </Typography>

            <Grid container spacing={2} sx={{ width: "100%" }}>
              {filtered.map((pl) => {
                const isLast = lastId === pl.id; // <- compara com a última acessada

                return (
                  <Grid key={pl.id} size={{ xs: 12, sm: 6, md: 4 }}>
                    <Card
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        background: (t) => (t.palette.mode === "dark" ? "#1b1b1b" : "#fff"),
                        border: (t) => `1px solid ${t.palette.divider}`,
                        position: "relative", 
                        outline: isLast ? (t) => `2px solid ${t.palette.warning.main}` : "none",
                        outlineOffset: -1,
                      }}
                    >
                      {isLast && (
                        <Chip
                          icon={<StarRoundedIcon />}
                          label="Last opened"
                          color="warning"
                          size="small"
                          sx={{ position: "absolute", top: 8, right: 8, fontWeight: 700 }}
                        />
                      )}

                      <CardContent sx={{ flexGrow: 1 }}>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                          <LibraryMusicRoundedIcon />
                          <Typography variant="h6" noWrap>
                            {pl.nome}
                          </Typography>
                        </Stack>

                        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                          <Chip size="small" label={`${pl.musicas?.length ?? 0} songs`} />
                          <Chip
                            size="small"
                            variant="outlined"
                            label={new Date(pl.createdAt).toLocaleDateString()}
                          />
                        </Stack>
                      </CardContent>

                      <CardActions>
                        <Button
                          size="small"
                          color="warning"
                          onClick={() => {
                            // salva como última acessada e navega
                            sessionStorage.setItem("last_playlist_id", pl.id);
                            setLastId(pl.id); // reflete imediatamente no UI
                            openDetails(pl);
                          }}
                        >
                          Open
                        </Button>
                        <IconButton aria-label="edit" onClick={() => handleOpenEdit(pl)}>
                          <EditRoundedIcon />
                        </IconButton>
                        <IconButton aria-label="delete" onClick={() => handleDelete(pl)}>
                          <DeleteRoundedIcon />
                        </IconButton>
                      </CardActions>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </>
        )}
      </Container>

      <Dialog open={openForm} onClose={() => setOpenForm(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editing ? "Edit playlist" : "New playlist"}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            fullWidth
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenForm(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" color="warning">
            {editing ? "Save" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );

};

export default Playlists;
