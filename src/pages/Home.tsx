import { Box, Container, Paper, Typography} from "@mui/material";
import Header from "../components/HomeHeader";

export default function Home() {
    return (
        <Box sx={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
            <Header/>

            <Container
                maxWidth="lg"
                sx={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    py: 6,
                }}
            >
                <Paper
                    elevation={6}
                    sx={{
                        p: { xs: 3, md: 6, },
                        textAlign: "center",
                        bgcolor: "background.paper",
                        maxWidth: 960,
                        width: "100%",
                        mx: "auto",
                    }}
                >
                    <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>
                        Organize your playlists with Fakefy
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                        Search for songs using the TheAudioDB API, create and manage your playlists,
                        all with protected routes, Redux, and local persistence. Choose between light
                        or dark theme and start building your soundtrack today. 💛
                    </Typography>
                </Paper>
            </Container>
        </Box>
    );
}
