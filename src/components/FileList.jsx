// src/components/FileList.js
import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Avatar,
  IconButton,
  OutlinedInput,
  InputAdornment,
  Tooltip,
  CircularProgress,
  Divider,
  Chip,
  Stack,
  useMediaQuery,
  useTheme,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import GetAppIcon from "@mui/icons-material/GetApp";
import PersonIcon from "@mui/icons-material/Person";
import GavelIcon from "@mui/icons-material/Gavel";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";

function fileExt(name = "") {
  const parts = name.split(".");
  return parts.length > 1 ? parts.pop().toLowerCase() : "file";
}

const personaData = [
  { id: "HR", name: "HR", color: "#0f62fe", icon: <PersonIcon /> },
  { id: "Legal", name: "Legal", color: "#6f42c1", icon: <GavelIcon /> },
  { id: "L1", name: "L1", color: "#00a86b", icon: <SupportAgentIcon /> },
  { id: "L2", name: "L2", color: "#ff7a00", icon: <SupportAgentIcon /> },
];

const extColorMap = {
  pdf: ["#fff5f5", "#d32f2f"],
  doc: ["#eef6ff", "#0f62fe"],
  docx: ["#eef6ff", "#0f62fe"],
  txt: ["#f7fff0", "#2e7d32"],
  csv: ["#fff8e6", "#ff7a00"],
  md: ["#f4f1ff", "#6f42c1"],
  png: ["#e8f9f7", "#00a86b"],
  jpg: ["#e8f9f7", "#00a86b"],
  jpeg: ["#e8f9f7", "#00a86b"],
  file: ["#f2f4f7", "#6b7280"],
};

export default function FileList() {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.only("sm"));
  const mdUp = useMediaQuery(theme.breakpoints.up("md"));
  const lgUp = useMediaQuery(theme.breakpoints.up("lg"));

  const [selectedRole, setSelectedRole] = useState("HR");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState({});

  useEffect(() => {
    let mounted = true;
    const fetchFiles = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get("http://localhost:8000/files", {
          params: { persona: selectedRole.toLowerCase() },
        });
        const serverFiles = Array.isArray(res.data.files) ? res.data.files : [];
        if (mounted) setFiles(serverFiles);
      } catch (err) {
        console.error(err);
        if (mounted) setError("Unable to load documents.");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchFiles();
    return () => {
      mounted = false;
    };
  }, [selectedRole]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const matched = q ? files.filter((f) => f.toLowerCase().includes(q)) : files.slice();
    return matched.slice().sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));
  }, [files, search]);

  const handleDownload = async (file) => {
    setDownloading((s) => ({ ...s, [file]: true }));
    try {
      const res = await axios.get("http://localhost:8000/preview-url", {
        params: { persona: selectedRole.toLowerCase(), filename: file },
      });
      const link = document.createElement("a");
      link.href = res.data.url;
      link.download = file;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Download failed:", err);
    } finally {
      setDownloading((s) => ({ ...s, [file]: false }));
    }
  };

  //const cols = lgUp ? 4 : mdUp ? 3 : isSm ? 2 : 1;

  return (
    <Box
      sx={{
        mt: 2,
        px: { xs: 2, sm: 3, md: 4 },
        pb: 4,
        background: "transparent",
        borderRadius: 2,
      }}
    >
      {/* Compact header aligned to workspace */}
     

      {/* Compact filter/search strip that spans full width */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 1, md: 1.25 },
          borderRadius: 2,
          mb: 2,
          display: "flex",
          gap: 2,
          alignItems: "center",
          flexWrap: "wrap",
          background: "linear-gradient(90deg, rgba(255,255,255,0.6), rgba(250,251,255,0.6))",
          border: "1px solid rgba(16,24,40,0.04)",
        }}
      >
        <Box sx={{ minWidth: 0, flex: "1 1 280px" }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0 }}>
            Files for <Box component="span" sx={{ color: "primary.main", fontWeight: 900 }}>{selectedRole}</Box>
          </Typography>
        </Box>

        <OutlinedInput
          size="small"
          placeholder="Search documents"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          startAdornment={
            <InputAdornment position="start">
              <SearchIcon fontSize="small" color="action" />
            </InputAdornment>
          }
          sx={{
            width: { xs: "100%", sm: 300 },
            borderRadius: 2,
            background: "#fff",
            "& .MuiOutlinedInput-notchedOutline": { border: "none" },
            boxShadow: "0 6px 18px rgba(16,24,40,0.03)",
            "&:hover": { boxShadow: "0 10px 28px rgba(16,24,40,0.04)" },
            "&.Mui-focused": { boxShadow: "0 12px 36px rgba(15,99,255,0.05)" },
          }}
        />
      </Paper>

      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
           Choose Role
        </Typography>

        <ToggleButtonGroup
          value={selectedRole}
          exclusive
          onChange={(_, val) => {
            if (val) setSelectedRole(val);
          }}
          aria-label="persona selector"
          sx={{
            display: "flex",
            gap: 1.5,
            flexWrap: "wrap",
          }}
        >
          {personaData.map((p) => {
            const active = selectedRole === p.id;
            return (
              <ToggleButton
                key={p.id}
                value={p.id}
                aria-label={p.name}
                sx={{
                  borderRadius: 2,
                  px: 1.25,
                  py: 0.5,
                  minWidth: 120,
                  bgcolor: active ? `${p.color}16` : "#fff",
                  border: active ? `2px solid ${p.color}` : "1px solid rgba(16,24,40,0.06)",
                  boxShadow: active ? `0 6px 18px ${p.color}22` : "none",
                  "&:hover": { transform: "translateY(-2px)", boxShadow: "0 8px 22px rgba(0,0,0,0.04)" },
                }}
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <Avatar
                    sx={{
                      bgcolor: active ? p.color : `${p.color}10`,
                      color: active ? "#fff" : p.color,
                      width: 36,
                      height: 36,
                    }}
                  >
                    {p.icon}
                  </Avatar>
                  <Box sx={{ textAlign: "left" }}>
                    <Typography sx={{ fontWeight: 800, fontSize: 13 }}>{p.name}</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11 }}>
                      {active ? "Active persona" : "Tap to select"}
                    </Typography>
                  </Box>
                </Stack>
              </ToggleButton>
            );
          })}
        </ToggleButtonGroup>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {loading ? (
        <Box sx={{ display: "flex", gap: 1.5, alignItems: "center", color: "text.secondary" }}>
          <CircularProgress size={18} />
          <Typography>Loading documents…</Typography>
        </Box>
      ) : error ? (
        <Paper sx={{ p: 2, background: "#fff4f4", borderRadius: 2 }}>
          <Typography color="error">{error}</Typography>
        </Paper>
      ) : filtered.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: "center", color: "text.secondary", borderRadius: 2, background: "#fbfbfe" }}>
          <Typography sx={{ fontWeight: 600, mb: 1 }}>No documents found</Typography>
          <Typography variant="caption">Try a different search or role.</Typography>
        </Paper>
      ) : (
        <Grid container spacing={2} alignItems="stretch">
          {filtered.map((file, idx) => {
            const ext = fileExt(file);
            const colors = extColorMap[ext] || extColorMap.file;
            const avatarBg = colors[0];
            const avatarColor = colors[1];

            return (
              <Grid key={idx} item xs={12} sm={6} md={4} lg={3}>
                <Card
                  elevation={2}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    height: "100%",
                    borderRadius: 2,
                    transition: "transform 0.18s ease, box-shadow 0.18s ease",
                    "&:hover": { transform: "translateY(-6px)", boxShadow: "0 18px 40px rgba(16,24,40,0.06)" },
                    px: 0,
                  }}
                >
                  <CardContent sx={{ display: "flex", gap: 1.25, alignItems: "center", p: 1.5 }}>
                    <Avatar
                      sx={{
                        bgcolor: avatarBg,
                        color: avatarColor,
                        width: 52,
                        height: 52,
                        fontWeight: 800,
                        fontSize: 13,
                        textTransform: "uppercase",
                        border: `1px solid ${avatarBg}`,
                      }}
                    >
                      {ext.slice(0, 3).toUpperCase()}
                    </Avatar>

                    <Box sx={{ overflow: "hidden", minWidth: 0 }}>
                      <Typography
                        sx={{
                          fontWeight: 800,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: { xs: 160, sm: 220, md: 280 },
                        }}
                        title={file}
                      >
                        {file}
                      </Typography>

                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                        <Chip
                          label={`.${ext}`}
                          size="small"
                          sx={{
                            bgcolor: "rgba(0,0,0,0.04)",
                            borderRadius: 1,
                            px: 0.6,
                            fontWeight: 700,
                            color: "text.secondary",
                          }}
                        />
                      </Stack>
                    </Box>
                  </CardContent>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      alignItems: "center",
                      p: 1,
                      pt: 0,
                      gap: 1,
                      background: "linear-gradient(180deg, rgba(255,255,255,0.6), rgba(250,251,255,0.6))",
                      borderBottomLeftRadius: 8,
                      borderBottomRightRadius: 8,
                    }}
                  >
                    <Tooltip title="Download">
                      <span>
                        <IconButton
                          onClick={() => handleDownload(file)}
                          size="small"
                          sx={{
                            bgcolor: "transparent",
                            color: "text.secondary",
                            "&:hover": { bgcolor: "rgba(0,170,107,0.06)", color: "#007a4d" },
                            transition: "all 140ms ease",
                          }}
                        >
                          {downloading[file] ? <CircularProgress size={16} /> : <GetAppIcon fontSize="small" />}
                        </IconButton>
                      </span>
                    </Tooltip>
                  </Box>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
}
