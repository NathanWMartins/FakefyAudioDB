import { useEffect, useMemo, useState } from "react";
import {
  Box, Container, Typography, TextField, Button, CircularProgress, List,
  ListItem, ListItemText, IconButton, Menu, MenuItem, Stack, ListItemButton
} from "@mui/material";
import AlbumRoundedIcon  from "@mui/icons-material/AlbumRounded";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../app/store";
import {
  loadTop10ByArtist,
  searchTracks,
  clearResults,
  clearTop10,
  loadPopularFromArtists,
  clearPopular,
  searchAlbumsByArtist,
} from "../redux/songSlice";
import { addTrackToPlaylist } from "../redux/playlistSlice";
import Header from "../components/UserHeader";
import type { TrackDetails } from "../components/TrackDetailsDialog";
import TrackDetailsDialog from "../components/TrackDetailsDialog";

type Mode = "popular" | "top10" | "search" | "album";

export default function Songs() {
  const dispatch = useDispatch<AppDispatch>();
  const { popular, top10, results, albums, loading, error } = useSelector((s: RootState) => s.song);

  const userId = useSelector((s: RootState) => s.user.session?.userId);

  const allPlaylists = useSelector((s: RootState) => s.playlists.items);

  const myPlaylists = useMemo(
    () => allPlaylists.filter(p => String(p.usuarioId) === String(userId ?? "")),
    [allPlaylists, userId]
  );

  const [q, setQ] = useState({ artist: "", title: "", album: "" });
  const [fx, setFx] = useState({ genre: "", year: "" });

  const [mode, setMode] = useState<Mode>("popular");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedTrack, setSelectedTrack] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTrack, setDialogTrack] = useState<TrackDetails | null>(null);

  useEffect(() => {
    dispatch(loadPopularFromArtists());
  }, [dispatch]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setFx({ genre: "", year: "" });

    if (q.album) {
      if (!q.artist) {
        return;
      }
      setMode("album" as any);
      dispatch(clearResults());
      dispatch(clearTop10());
      dispatch(clearPopular());
      dispatch(searchAlbumsByArtist({ artist: q.artist.trim(), album: q.album.trim() }));
      return;
    }

    if (q.artist && q.title) {
      setMode("search");
      dispatch(clearTop10());
      dispatch(clearResults());
      dispatch(searchTracks({ artist: q.artist.trim(), title: q.title.trim() }));
      return;
    }

    if (q.artist && !q.title) {
      setMode("top10");
      dispatch(clearResults());
      dispatch(loadTop10ByArtist(q.artist.trim()));
      return;
    }

    setMode("popular");
    dispatch(clearResults());
    dispatch(clearTop10());
    dispatch(clearPopular());
    dispatch(loadPopularFromArtists());
  }


  function resetAll() {
    setQ({ artist: "", title: "", album: "" });
    setFx({ genre: "", year: "" });
    setMode("popular");
    dispatch(clearResults());
    dispatch(clearTop10());
    dispatch(clearPopular());
    dispatch(loadPopularFromArtists());
  }

  function handleOpenMenu(e: React.MouseEvent<HTMLElement>, track: any) {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
    setSelectedTrack(track);
  }

  function handleCloseMenu() {
    setAnchorEl(null);
    setSelectedTrack(null);
  }

  function handleAddToPlaylist(playlistId: string) {
    if (selectedTrack) {
      dispatch(addTrackToPlaylist({ playlistId, track: selectedTrack }));
    }
    handleCloseMenu();
  }

  function openDetails(track: any) {
    setDialogTrack(track);
    setDialogOpen(true);
  }
  function closeDetails() {
    setDialogOpen(false);
    setDialogTrack(null);
  }

  const baseList =
    mode === "popular" ? popular :
      mode === "top10" ? top10 :
        mode === "album" ? albums :
          results;

  const shownList = useMemo(() => {
    if (mode === "search" || mode === "album") return baseList as any[];
    return (baseList as any[])
      .filter(t => (!fx.genre ? true : (t.genre ?? "").toLowerCase().includes(fx.genre.toLowerCase())))
      .filter(t => (!fx.year ? true : (t.year ?? "").includes(fx.year)));
  }, [baseList, fx.genre, fx.year, mode]);

  return (
    <>
      <Header />
      <Container sx={{ py: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 3 }}>Songs</Typography>

        {/* FORM DE BUSCA */}
        <Box component="form" onSubmit={handleSearch} sx={{ mb: 2 }}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems="flex-start">
            <TextField
              label="Artist"
              value={q.artist}
              onChange={(e) => setQ({ ...q, artist: e.target.value })}
            />
            <TextField
              label="Song name"
              value={q.title}
              onChange={(e) => setQ({ ...q, title: e.target.value })}
              helperText="Requires artist"
            />
            <TextField
              label="Album"
              value={q.album}
              onChange={(e) => setQ({ ...q, album: e.target.value })}
              helperText="Requires artist"
            />
            <Stack direction="row" spacing={1}>
              <Button type="submit" variant="contained" disabled={loading}>Search</Button>
              <Button onClick={resetAll} variant="text">Clear</Button>
            </Stack>
          </Stack>
        </Box>

        {/* FILTROS VISUAIS */}
        {mode !== "search" && (
          <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ mb: 2 }}>
            <TextField label="Genre" value={fx.genre} onChange={(e) => setFx({ ...fx, genre: e.target.value })} />
            <TextField label="Year" value={fx.year} onChange={(e) => setFx({ ...fx, year: e.target.value })} />
          </Stack>
        )}

        {/* TÍTULO DA LISTA */}
        <Typography variant="h6" sx={{ mb: 2 }}>
          {mode === "popular" && "Popular picks (aggregated)"}
          {mode === "top10" && `Top 10 — ${q.artist}`}
          {mode === "search" && "Search results (tracks)"}
          {mode === "album" && `Album results — ${q.artist} / ${q.album}`}
        </Typography>

        {/* LISTA */}
        {loading && shownList.length === 0 && <CircularProgress />}
        {error && <Typography color="error">{error}</Typography>}
        {!loading && shownList.length === 0 && <Typography color="text.secondary">No results.</Typography>}

        <List>
          {(shownList as any[]).map((item: any) => {
            const isAlbum = !!item.artist && !!item.name && item.id && item.thumb !== undefined && (mode === "album");
            return (
              <ListItem
                key={item.id}
                secondaryAction={
                  !isAlbum && (
                    <IconButton edge="end" onClick={(e) => handleOpenMenu(e, item)}>
                      <PlaylistAddIcon />
                    </IconButton>
                  )
                }
              >
                <ListItemButton onClick={() => (isAlbum ? null : openDetails(item))}>
                  {isAlbum ? (
                    <ListItemText
                      primary={
                        <Stack direction="row" spacing={1} alignItems="center">
                          <AlbumRoundedIcon fontSize="small" />
                          <span>{item.name} — {item.artist}</span>
                        </Stack>
                      }
                      secondary={`${item.genre ?? "Unknown"} · ${item.year ?? "?"}`}
                    />
                  ) : (
                    <ListItemText
                      primary={`${item.name} — ${item.artist}`}
                      secondary={`${item.genre ?? "Unknown"} · ${item.year ?? "?"} · Views: ${item.stats?.views ?? "-"}`}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>


        {/* MENU */}
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
          {!userId ? (
            <MenuItem disabled>Sign in to add</MenuItem>
          ) : myPlaylists.length === 0 ? (
            <MenuItem disabled>No playlists for this user</MenuItem>
          ) : (
            myPlaylists.map((pl) => (
              <MenuItem key={pl.id} onClick={() => handleAddToPlaylist(pl.id)}>
                {pl.nome}
              </MenuItem>
            ))
          )}
        </Menu>
      </Container>

      {/* DIALOG DE DETALHE */}
      <TrackDetailsDialog open={dialogOpen} track={dialogTrack} onClose={closeDetails} />
    </>
  );
}
