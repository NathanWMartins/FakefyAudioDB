import { Fab, Tooltip } from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

type Props = {
    darkMode: boolean;
    onToggle: () => void;
};

export default function ThemeToggleFab({ darkMode, onToggle }: Props) {
    return (
        <Tooltip title="Toggle theme">
            <Fab
                color="primary"
                onClick={onToggle}
                sx={{
                    position: "fixed",
                    bottom: 24,
                    right: 24,
                    zIndex: 1300,
                }}
            >
                {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
            </Fab>
        </Tooltip>
    );
}