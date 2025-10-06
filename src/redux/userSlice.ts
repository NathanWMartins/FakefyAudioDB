import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { session } from "../app/storage";

type SessionData = {
    userId: string;
    email: string;
    lastLogin: string;
    lastPlaylistId?: string | null;
};

type UserState = {
    authenticated: boolean;
    session: SessionData | null;
};

const SESSION_KEY = "app/session";

const initial: UserState = {
    authenticated: !!session.get<SessionData>(SESSION_KEY),
    session: session.get<SessionData>(SESSION_KEY),
};

const userSlice = createSlice({
    name: "user",
    initialState: initial,
    reducers: {
        login(state, action: PayloadAction<{ email: string; senha: string }>) {
            const { email, senha } = action.payload;

            const okEmail = /^\S+@\S+\.\S+$/.test(email);
            const okSenha = senha.length >= 6;
            if (!okEmail) throw new Error("Invalid email");
            if (!okSenha) throw new Error("Password must have at least 6 characters");

            const s: SessionData = {
                userId: crypto.randomUUID(),     
                email,
                lastLogin: new Date().toISOString(),
                lastPlaylistId: null,
            };

            session.set(SESSION_KEY, s);

            window.sessionStorage.setItem("last_login", s.lastLogin);
            window.sessionStorage.setItem("user_email", s.email);
            window.sessionStorage.setItem("user_id", s.userId);

            state.authenticated = true;
            state.session = s;
        },

        logout(state) {
            session.remove(SESSION_KEY);
            state.authenticated = false;
            state.session = null;

            window.sessionStorage.removeItem("user_email");
            window.sessionStorage.removeItem("user_id");
        },

        setLastPlaylist(state, action: PayloadAction<string | null>) {
            if (!state.session) return;
            state.session.lastPlaylistId = action.payload;
            session.set(SESSION_KEY, state.session);
            if (action.payload) {
                window.sessionStorage.setItem("last_playlist_id", action.payload);
            } else {
                window.sessionStorage.removeItem("last_playlist_id");
            }
        },
    },
});

export const { login, logout, setLastPlaylist } = userSlice.actions;
export default userSlice.reducer;
