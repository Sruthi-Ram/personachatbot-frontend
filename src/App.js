// src/App.js
import React, { useState } from "react";
import {
  ThemeProvider,
  CssBaseline,
  Box,
  Typography,
  Tabs,
  Tab,
  createTheme,
  AppBar,
  Toolbar,
  Container,
  Paper,
  Avatar,
  useMediaQuery,
  Stack,
} from "@mui/material";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import ChatBox from "./components/ChatBox";
import UploadBox from "./components/UploadBox";
import FileList from "./components/FileList";

const theme = createTheme({
  palette: {
    primary: { main: "#0f62fe", contrastText: "#ffffff" },
    success: { main: "#03dac6" },
    secondary: { main: "#6f42c1" },
    neutral: { main: "#6b7280" },
    background: { default: "#f5f7fb", paper: "#ffffff" },
    text: { primary: "#0f1720", secondary: "#475569" },
  },
  typography: {
    fontFamily: '"Inter","Roboto","Helvetica","Arial",sans-serif',
    h4: { fontWeight: 800, letterSpacing: 0.2 },
    h6: { fontWeight: 800 },
    button: { textTransform: "none", fontWeight: 700 },
  },
  components: {
    MuiTabs: {
      styleOverrides: {
        root: { minHeight: 40 },
        indicator: { display: "none" },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none",
          minHeight: 40,
          padding: "8px 14px",
          borderRadius: 22,
        },
      },
    },
  },
});

export default function App() {
  const [tab, setTab] = useState("chat");
  const isSm = useMediaQuery(theme.breakpoints.down("sm"));

  const tabStyles = (active) => ({
    borderRadius: 22,
    mr: 1,
    px: 1.25,
    py: 0.5,
    transition: "all 140ms ease",
    bgcolor: active ? "rgba(15,99,255,0.08)" : "transparent",
    color: active ? "primary.main" : "text.primary",
    "&:hover": { transform: "translateY(-1.5px)", bgcolor: active ? "rgba(15,99,255,0.10)" : "rgba(15,99,255,0.03)" },
    "& .MuiTab-iconWrapper": { color: "inherit", mr: 0.75 },
    "& .MuiTab-wrapper": { gap: 6, alignItems: "center" },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <AppBar
        position="static"
        color="transparent"
        elevation={0}
        sx={{
          mt: 2, // <- adds breathing room from browser chrome
          mb: 3,
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            px: { xs: 2, md: 4 },
            py: { xs: 0.8, md: 1 }, // slightly reduced vertical padding for compact look
            background: "linear-gradient(90deg, rgba(255,255,255,0.6), rgba(250,251,255,0.45))",
            borderBottom: "1px solid rgba(16,24,40,0.04)",
            borderRadius: 2,
          }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Avatar
              sx={{
                bgcolor: theme.palette.primary.main,
                width: 40,
                height: 40,
                fontWeight: 700,
                boxShadow: "0 6px 14px rgba(15,23,36,0.06)",
                fontSize: 14,
              }}
            >
              PA
            </Avatar>

            <Box>
              <Typography variant="h4" sx={{ color: theme.palette.primary.main, fontSize: 20 }}>
                Persona Assistant
              </Typography>
              <Typography variant="caption" sx={{ color: "text.secondary", fontSize: 11 }}>
                Modern assistants for HR, Legal and Support
              </Typography>
            </Box>
          </Stack>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: 13 }}>
              Enterprise v1.0
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mb: 5 }}>
        <Paper
          elevation={4}
          sx={{
            borderRadius: 2.5,
            p: { xs: 2, md: 3 },
            background: "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(247,249,255,0.98))",
            boxShadow: "0 14px 40px rgba(16,24,40,0.06)",
            border: "1px solid rgba(15,23,36,0.035)",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: "center",
              justifyContent: "space-between",
              gap: 1.5,
              mb: 2.5,
            }}
          >
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="h4" sx={{ mb: 0.25, fontSize: { xs: 18, md: 20 } }}>
                Welcome to Persona Chatbot.
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
                Chat, upload, and manage documents — compact, focused workspace.
              </Typography>
            </Box>

            <Paper
              elevation={0}
              sx={{
                display: "inline-flex",
                borderRadius: 99,
                px: 0.5,
                py: 0.4,
                bgcolor: "rgba(15,99,255,0.035)",
                border: "1px solid rgba(15,99,255,0.06)",
              }}
            >
              <Tabs
                value={tab}
                onChange={(e, v) => setTab(v)}
                aria-label="main tabs"
                variant={isSm ? "scrollable" : "standard"}
                sx={{ "& .MuiTab-root": { minWidth: 76 }, py: 0.15 }}
              >
                <Tab value="chat" label="Chat" icon={<ChatBubbleOutlineIcon />} iconPosition="start" sx={tabStyles(tab === "chat")} />
                <Tab value="upload" label="Upload" icon={<CloudUploadIcon />} iconPosition="start" sx={tabStyles(tab === "upload")} />
                <Tab value="documents" label="Documents" icon={<FolderOpenIcon />} iconPosition="start" sx={tabStyles(tab === "documents")} />
              </Tabs>
            </Paper>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                px: { xs: 2, md: 2.5 },
                py: 1.5,
                borderRadius: 1.5,
                background:
                  tab === "chat"
                    ? "linear-gradient(90deg, rgba(15,99,255,0.04), rgba(15,99,255,0.01))"
                    : tab === "upload"
                    ? "linear-gradient(90deg, rgba(3,218,198,0.04), rgba(3,218,198,0.01))"
                    : "linear-gradient(90deg, rgba(111,66,193,0.04), rgba(111,66,193,0.01))",
                border: "1px solid rgba(15,23,36,0.012)",
                boxShadow: "0 4px 12px rgba(15,23,36,0.02)",
              }}
            >
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: 1.5,
                  display: "grid",
                  placeItems: "center",
                  bgcolor: tab === "chat" ? "rgba(15,99,255,0.10)" : tab === "upload" ? "rgba(3,218,198,0.10)" : "rgba(111,66,193,0.10)",
                  color: tab === "chat" ? "primary.main" : tab === "upload" ? "success.main" : "secondary.main",
                  boxShadow: "0 4px 12px rgba(15,23,36,0.02)",
                }}
              >
                {tab === "chat" ? <ChatBubbleOutlineIcon fontSize="small" /> : tab === "upload" ? <CloudUploadIcon fontSize="small" /> : <FolderOpenIcon fontSize="small" />}
              </Box>

              <Box sx={{ minWidth: 0 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, fontSize: 15 }}>
                  {tab === "chat" ? "Conversations" : tab === "upload" ? "Uploads" : "Documents"}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: 12, maxWidth: 640 }}>
                  {tab === "chat"
                    ? "Real-time assistant conversations with persona context and secure attachments."
                    : tab === "upload"
                    ? "Drag, drop, or browse files. Uploads are validated and stored securely."
                    : "Browse, search, and download documents with enterprise-grade controls."}
                </Typography>
              </Box>

              <Box sx={{ flex: 1 }} />

              <Box
                sx={{
                  width: { xs: "100%", md: 160 },
                  minWidth: { md: 140 },
                  borderRadius: 1.5,
                  p: 1,
                  background: "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(250,251,255,0.98))",
                  border: "1px solid rgba(15,23,36,0.03)",
                  boxShadow: "0 4px 12px rgba(15,23,36,0.02)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 0.5,
                  alignItems: "flex-start",
                  justifyContent: "center",
                }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: 13 }}>
                  {tab === "chat" ? "Quick Tips" : tab === "upload" ? "Upload Rules" : "Doc Actions"}
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.3, fontSize: 12 }}>
                  {tab === "chat"
                    ? "Use personas for focused responses; keep prompts concise."
                    : tab === "upload"
                    ? "Accepted: PDF, DOCX, TXT. Max 50MB. Files are scanned."
                    : "Use search; download files."}
                </Typography>

                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.4, fontSize: 11 }}>
                  {tab === "chat" ? "Tip: start with one line." : tab === "upload" ? "Tip: compress images." : "Tip: sort by file name."}
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                flex: 1,
                minHeight: 420,
                p: { xs: 1.5, md: 2.5 },
                borderRadius: 1.5,
                background: "transparent",
                transition: "all 160ms ease",
              }}
            >
              {tab === "chat" && <ChatBox />}
              {tab === "upload" && <UploadBox />}
              {tab === "documents" && <FileList />}
            </Box>
          </Box>
        </Paper>
      </Container>
    </ThemeProvider>
  );
}
