import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../app/store";

export type Track = {
    id: string;
    name: string;
    artist: string;
    genre?: string;
    year?: string;
};

export type Playlist = {
    id: string;
    nome: string;       
    usuarioId: string;
    musicas: Track[];
    createdAt: number;  
    updatedAt?: number;
};

type PlaylistState = {
    items: Playlist[];
};

const PLAYLISTS_KEY = "fakefy:playlists";

function load(): Playlist[] {
    try {
        const raw = localStorage.getItem(PLAYLISTS_KEY);
        const arr = raw ? (JSON.parse(raw) as Playlist[]) : [];
        return arr.map((p) => ({
            ...p,
            musicas: Array.isArray(p.musicas) ? p.musicas : [],
        }));
    } catch {
        return [];
    }
}
function persist(items: Playlist[]) {
    try {
        localStorage.setItem(PLAYLISTS_KEY, JSON.stringify(items));
    } catch {
        
    }
}

const initialState: PlaylistState = {
    items: load(),
};

const playlistsSlice = createSlice({
    name: "playlists",
    initialState,
    reducers: {
        addPlaylist(
            state,
            action: PayloadAction<{ nome: string; usuarioId: string; id?: string }>
        ) {
            const { nome, usuarioId, id } = action.payload;
            const now = Date.now();
            const pl: Playlist = {
                id: id ?? crypto.randomUUID(),
                nome: nome.trim(),
                usuarioId,
                musicas: [],
                createdAt: now,
                updatedAt: now,
            };
            state.items.unshift(pl);
            persist(state.items);
        },
        updatePlaylistName(
            state,
            action: PayloadAction<{ id: string; nome: string }>
        ) {
            const it = state.items.find((p) => p.id === action.payload.id);
            if (it) {
                it.nome = action.payload.nome.trim();
                it.updatedAt = Date.now();
                persist(state.items);
            }
        },
        removePlaylist(state, action: PayloadAction<{ id: string }>) {
            state.items = state.items.filter((p) => p.id !== action.payload.id);
            persist(state.items);
        },
        addTrackToPlaylist(
            state,
            action: PayloadAction<{ playlistId: string; track: Track }>
        ) {
            const { playlistId, track } = action.payload;
            const it = state.items.find((p) => p.id === playlistId);
            if (!it) return;
            const exists = it.musicas.some((t) => t.id === track.id);
            if (!exists) {
                it.musicas.push(track);
                it.updatedAt = Date.now();
                persist(state.items);
            }
        },
        removeTrackFromPlaylist(
            state,
            action: PayloadAction<{ playlistId: string; trackId: string }>
        ) {
            const { playlistId, trackId } = action.payload;
            const it = state.items.find((p) => p.id === playlistId);
            if (!it) return;
            it.musicas = it.musicas.filter((t) => t.id !== trackId);
            it.updatedAt = Date.now();
            persist(state.items);
        },
        reorderTracks(
            state,
            action: PayloadAction<{ playlistId: string; from: number; to: number }>
        ) {
            const { playlistId, from, to } = action.payload;
            const it = state.items.find((p) => p.id === playlistId);
            if (!it) return;
            if (
                from < 0 ||
                to < 0 ||
                from >= it.musicas.length ||
                to >= it.musicas.length
            )
                return;
            const [moved] = it.musicas.splice(from, 1);
            it.musicas.splice(to, 0, moved);
            it.updatedAt = Date.now();
            persist(state.items);
        },
        clearByUser(state, action: PayloadAction<{ usuarioId: string }>) {
            state.items = state.items.filter((p) => p.usuarioId !== action.payload.usuarioId);
            persist(state.items);
        },
        reloadFromStorage(state) {
            state.items = load();
        },
    },
});

export const {
    addPlaylist,
    updatePlaylistName,
    removePlaylist,
    addTrackToPlaylist,
    removeTrackFromPlaylist,
    reorderTracks,
    clearByUser,
    reloadFromStorage,
} = playlistsSlice.actions;

export const updatePlaylist = updatePlaylistName;
export const deletePlaylist = removePlaylist; 

export const selectAllPlaylists = (s: RootState) => s.playlists.items;

export const selectPlaylistsByUser = (s: RootState, usuarioId?: string | number) =>
    s.playlists.items.filter((p) => String(p.usuarioId) === String(usuarioId ?? ""));

export const selectPlaylistById =
    (id: string) =>
        (s: RootState): Playlist | undefined =>
            s.playlists.items.find((p) => p.id === id);

export const selectTracksCount =
    (id: string) =>
        (s: RootState): number =>
            s.playlists.items.find((p) => p.id === id)?.musicas.length ?? 0;

export default playlistsSlice.reducer;
