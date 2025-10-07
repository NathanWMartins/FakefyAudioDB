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

const USERS_KEY = "app/users";
type UserRegistryItem = { email: string; userId: string; createdAt: number };

function loadUsers(): UserRegistryItem[] {
    try {
        const raw = localStorage.getItem(USERS_KEY);
        return raw ? (JSON.parse(raw) as UserRegistryItem[]) : [];
    } catch {
        return [];
    }
}

function saveUsers(users: UserRegistryItem[]) {
    try {
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
    } catch { }
}

function getOrCreateUserId(email: string): string {
    const users = loadUsers();
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (found) return found.userId;

    const userId = crypto.randomUUID();
    users.push({ email, userId, createdAt: Date.now() });
    saveUsers(users);
    return userId;
}

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

            const userId = getOrCreateUserId(email);

            const s: SessionData = {
                userId,
                email,
                lastLogin: new Date().toISOString(),
                lastPlaylistId: sessionStorage.getItem("last_playlist_id") ?? null,
            };

            session.set(SESSION_KEY, s);

            sessionStorage.setItem("last_login", s.lastLogin);
            sessionStorage.setItem("user_email", s.email);
            sessionStorage.setItem("user_id", s.userId);

            state.authenticated = true;
            state.session = s;
        },

        logout(state) {
            session.remove(SESSION_KEY);
            state.authenticated = false;
            state.session = null;
            sessionStorage.removeItem("user_email");
            sessionStorage.removeItem("user_id");
        },

        setLastPlaylist(state, action: PayloadAction<string | null>) {
            if (!state.session) return;
            state.session.lastPlaylistId = action.payload;
            session.set(SESSION_KEY, state.session);
            if (action.payload) sessionStorage.setItem("last_playlist_id", action.payload);
            else sessionStorage.removeItem("last_playlist_id");
        },
    },
});

export const { login, logout, setLastPlaylist } = userSlice.actions;
export default userSlice.reducer;
