import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import type { RootState } from "../app/store";

export default function Route() {
    const authenticated = useSelector((s: RootState) => s.user.authenticated);
    return authenticated ? <Outlet /> : <Navigate to="/" replace />;
}
