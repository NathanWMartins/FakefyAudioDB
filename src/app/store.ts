import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../redux/userSlice";
import playlistReducer from "../redux/playlistSlice";
import songReducer from "../redux/songSlice";

export const store = configureStore({
    reducer: {
        user: userReducer,
        playlists: playlistReducer,
        song: songReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
