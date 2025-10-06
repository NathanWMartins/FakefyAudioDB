import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type Track = {
    id: string;
    name: string;
    artist: string;
    genre?: string;
    year?: string;
    album?: string;
    albumId?: string;
    thumb?: string;
    videoUrl?: string;
    descEN?: string;
    style?: string;
    mood?: string;
    theme?: string;
    stats?: { plays?: string; listeners?: string; views?: string; likes?: string; loved?: string };
    score?: number;
    raw?: any;
};

export type Album = {
    id: string;
    name: string;
    artist: string;
    year?: string;
    genre?: string;
    thumb?: string;
};

const mapAlbum = (a: any): Album => ({
    id: a.idAlbum,
    name: a.strAlbum,
    artist: a.strArtist,
    year: a.intYearReleased ?? undefined,
    genre: a.strGenre ?? undefined,
    thumb: a.strAlbumThumb ?? undefined,
});

const KEY = "2";
const BASE = `https://www.theaudiodb.com/api/v1/json/${KEY}`;

function mapTrack(t: any): Track {
    return {
        id: t.idTrack,
        name: t.strTrack,
        artist: t.strArtist,
        genre: t.strGenre ?? undefined,
        year: t.intYearReleased ?? undefined,
        album: t.strAlbum ?? undefined,
        albumId: t.idAlbum ?? undefined,
        thumb: t.strTrackThumb ?? undefined,
        videoUrl: t.strMusicVid ?? undefined,
        descEN: t.strDescriptionEN ?? undefined,
        style: t.strStyle ?? undefined,
        mood: t.strMood ?? undefined,
        theme: t.strTheme ?? undefined,
        stats: {
            plays: t.intTotalPlays ?? undefined,
            listeners: t.intTotalListeners ?? undefined,
            views: t.intMusicVidViews ?? undefined,
            likes: t.intMusicVidLikes ?? undefined,
            loved: t.intLoved ?? undefined,
        },
        raw: t,
    };
}

const ARTISTS: string[] = [
    "Michael Jackson", "Queen", "Coldplay", "Adele", "The Beatles", "Taylor Swift", "Ed Sheeran",
    "Beyonce", "Rihanna", "Drake", "Bruno Mars", "The Weeknd", "Linkin Park", "Imagine Dragons",
    "Maroon 5", "Eminem", "Lady Gaga", "Shakira", "Katy Perry", "U2"
];

export const loadTop10ByArtist = createAsyncThunk("song/loadTop10ByArtist", async (artist: string) => {
    const res = await fetch(`${BASE}/track-top10.php?s=${encodeURIComponent(artist)}`);
    if (!res.ok) throw new Error("Top 10 request failed");
    const json = await res.json();
    const arr = (json?.track ?? []) as any[];
    return arr.map(mapTrack) as Track[];
});

export const loadPopularFromArtists = createAsyncThunk("song/loadPopularFromArtists", async () => {
    const settled = await Promise.allSettled(
        ARTISTS.map(a => fetch(`${BASE}/track-top10.php?s=${encodeURIComponent(a)}`).then(r => r.json()))
    );
    const merged: any[] = [];
    for (const r of settled) {
        if (r.status === "fulfilled" && r.value?.track) merged.push(...r.value.track);
    }
    const mapped = merged.map(mapTrack);
    const seen = new Set<string>();
    const dedup = mapped.filter(t => (seen.has(t.id) ? false : (seen.add(t.id), true)));

    const num = (x?: string) => (x ? Number(x) : 0);
    const scored = dedup.map(t => ({
        ...t,
        score: num(t.stats?.views)
    }));

    scored.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
    return scored.slice(0, 100);
});

export const searchTracks = createAsyncThunk(
    "song/searchTracks",
    async (params: { artist?: string; title?: string; album?: string }) => {
        const { artist = "", title = "", album = "" } = params;

        const results: any[] = [];

        if (artist && title) {
            const res = await fetch(
                `${BASE}/searchtrack.php?s=${encodeURIComponent(artist)}&t=${encodeURIComponent(title)}`
            );
            const json = await res.json();
            results.push(
                ...((json?.track ?? []) as any[]).map((t) => ({
                    ...mapTrack(t),
                    kind: "track",
                }))
            );
        } else if (title && !artist) {
            const res = await fetch(
                `${BASE}/searchtrack.php?t=${encodeURIComponent(title)}`
            );
            const json = await res.json();
            results.push(
                ...((json?.track ?? []) as any[]).map((t) => ({
                    ...mapTrack(t),
                    kind: "track",
                }))
            );
        }

        if (album) {
            const url = artist
                ? `${BASE}/searchalbum.php?s=${encodeURIComponent(artist)}&a=${encodeURIComponent(album)}`
                : `${BASE}/searchalbum.php?a=${encodeURIComponent(album)}`;
            const res = await fetch(url);
            const json = await res.json();
            results.push(
                ...((json?.album ?? []) as any[]).map((a) => ({
                    id: a.idAlbum,
                    name: a.strAlbum,
                    artist: a.strArtist,
                    year: a.intYearReleased,
                    genre: a.strGenre,
                    thumb: a.strAlbumThumb,
                    kind: "album",
                }))
            );
        }

        return results;
    }
);

export const searchAlbumsByArtist = createAsyncThunk(
    "song/searchAlbumsByArtist",
    async (params: { artist: string; album: string }) => {
        const { artist, album } = params;
        if (!artist?.trim() || !album?.trim()) return [] as Album[];

        const url = `${BASE}/searchalbum.php?s=${encodeURIComponent(artist)}&a=${encodeURIComponent(album)}`;
        const res = await fetch(url);
        const json = await res.json();
        return ((json?.album ?? []) as any[]).map(mapAlbum);
    }
);

type SongState = {
    popular: Track[];
    top10: Track[];
    results: Track[];
    albums: Album[];
    loading: boolean;
    error: string | null;
};

const initialState: SongState = {
    popular: [],
    top10: [],
    results: [],
    albums: [],
    loading: false,
    error: null,
};

const songSlice = createSlice({
    name: "song",
    initialState,
    reducers: {
        clearResults(state) { state.results = []; },
        clearTop10(state) { state.top10 = []; },
        clearPopular(state) { state.popular = []; },
        clearAlbums(state) { state.albums = []; },
    },
    extraReducers: builder => {
        builder
            .addCase(loadPopularFromArtists.pending, s => { s.loading = true; s.error = null; })
            .addCase(loadPopularFromArtists.fulfilled, (s, a: PayloadAction<Track[]>) => {
                s.loading = false; s.popular = a.payload;
            })
            .addCase(loadPopularFromArtists.rejected, (s, a) => {
                s.loading = false; s.error = a.error.message || "Failed to load popular picks";
            })
            .addCase(loadTop10ByArtist.pending, s => { s.loading = true; s.error = null; })
            .addCase(loadTop10ByArtist.fulfilled, (s, a: PayloadAction<Track[]>) => {
                s.loading = false; s.top10 = a.payload;
            })
            .addCase(loadTop10ByArtist.rejected, (s, a) => {
                s.loading = false; s.error = a.error.message || "Failed to load Top 10";
            })
            .addCase(searchTracks.pending, s => { s.loading = true; s.error = null; })
            .addCase(searchTracks.fulfilled, (s, a: PayloadAction<Track[]>) => {
                s.loading = false; s.results = a.payload;
            })
            .addCase(searchTracks.rejected, (s, a) => {
                s.loading = false; s.error = a.error.message || "Search failed";
            })
            .addCase(searchAlbumsByArtist.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.albums = [];
            })
            .addCase(searchAlbumsByArtist.fulfilled, (state, action) => {
                state.loading = false;
                state.albums = action.payload;
            })
            .addCase(searchAlbumsByArtist.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message ?? "Failed to search albums";
            });
    }
});

export const { clearResults, clearTop10, clearPopular, clearAlbums } = songSlice.actions;
export default songSlice.reducer;
