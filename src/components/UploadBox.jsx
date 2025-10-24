// src/components/UploadBox.js
import React, { useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  Typography,
  Button,
  LinearProgress,
  Box,
  Stack,
  Grid,
  Paper,
  Avatar,
  Snackbar,
  Alert,
  Chip,
  IconButton,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import PersonIcon from "@mui/icons-material/Person";
import GavelIcon from "@mui/icons-material/Gavel";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import CloseIcon from "@mui/icons-material/Close";

const roles = [
  { id: "HR", label: "HR", color: "#1976d2", icon: <PersonIcon /> },
  { id: "Legal", label: "Legal", color: "#6f42c1", icon: <GavelIcon /> },
  { id: "L1", label: "L1", color: "#1e9e66", icon: <SupportAgentIcon /> },
  { id: "L2", label: "L2", color: "#fd7e14", icon: <SupportAgentIcon /> },
];

function formatBytes(bytes = 0) {
  if (!bytes) return "0 B";
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), sizes.length - 1);
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
}

export default function UploadBox() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fileMeta, setFileMeta] = useState(null);
  const [selectedRole, setSelectedRole] = useState("HR");
  const [snackbar, setSnackbar] = useState({ open: false, severity: "success", message: "" });

  const handleCloseSnackbar = () => setSnackbar((s) => ({ ...s, open: false }));

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !selectedRole) return;

    setFileMeta({ name: file.name, size: file.size, type: file.type || "unknown" });
    setUploading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("persona", selectedRole);

    try {
      const res = await axios.post("http://localhost:8000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setProgress(percent);
          }
        },
      });

      setSnackbar({
        open: true,
        severity: "success",
        message: `Uploaded ${res?.data?.filename || file.name} to ${selectedRole}`,
      });

      setTimeout(() => {
        setUploading(false);
        setProgress(0);
        setFileMeta(null);
      }, 800);
    } catch (err) {
      console.error("Upload failed:", err);
      setSnackbar({ open: true, severity: "error", message: "Upload failed. Try again." });
      setUploading(false);
      setProgress(0);
    }
  };

  const roleObj = roles.find((r) => r.id === selectedRole) || roles[0];

  return (
    <Card
      sx={{
        mt: 2,
        width: "100%",
        borderRadius: 2,
        p: { xs: 1.25, md: 2 },
        boxShadow: "0 8px 28px rgba(16,24,40,0.06)",
        background: "linear-gradient(180deg, #ffffff 0%, #fbfdff 100%)",
      }}
      elevation={3}
    >
      <CardContent sx={{ p: { xs: 1.25, md: 2 } }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2, flexWrap: "wrap" }}>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, fontSize: 15 }}>
              Upload Documents
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.25, fontSize: 12 }}>
              Pick a persona card then upload. Files are attached to the selected assistant.
            </Typography>
          </Box>

          <Box sx={{ flex: 1 }} />

          <Stack direction="row" spacing={1} alignItems="center" sx={{ ml: 1 }}>
            <Button
              variant="contained"
              component="label"
              startIcon={<CloudUploadIcon />}
              sx={{
                textTransform: "none",
                bgcolor: roleObj.color,
                "&:hover": { bgcolor: roleObj.color },
                boxShadow: "0 8px 24px rgba(16,24,40,0.06)",
                px: 2.5,
                py: 0.7,
                fontSize: 13,
              }}
            >
              Choose File
              <input type="file" hidden onChange={handleUpload} />
            </Button>
          </Stack>
        </Box>

        <Grid container spacing={2} sx={{ mb: 2 }}>
          {roles.map((r) => {
            const selected = selectedRole === r.id;
            return (
              <Grid key={r.id} item xs={6} sm={3}>
                <Paper
                  elevation={selected ? 6 : 1}
                  onClick={() => setSelectedRole(r.id)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.25,
                    px: 1.5,
                    py: 1.25,
                    borderRadius: 1.5,
                    cursor: "pointer",
                    transition: "transform 160ms ease, box-shadow 160ms ease",
                    border: selected ? `1px solid ${r.color}` : "1px solid rgba(16,24,40,0.06)",
                    bgcolor: selected ? `${r.color}12` : "#fff",
                    "&:hover": { transform: "translateY(-4px)", boxShadow: selected ? "0 14px 34px rgba(16,24,40,0.06)" : "0 10px 26px rgba(16,24,40,0.05)" },
                    height: "100%",
                  }}
                >
                  <Avatar sx={{ bgcolor: r.color, color: "#fff", width: 42, height: 42 }}>{r.icon}</Avatar>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography sx={{ fontWeight: 800, fontSize: 13 }}>{r.label}</Typography>
                    <Typography variant="caption" color="text.secondary" noWrap sx={{ fontSize: 11 }}>
                      {selected ? "Selected" : "Click to select"}
                    </Typography>
                  </Box>

                  <Box sx={{ flex: 1 }} />

                  {selected && (
                    <IconButton
                      aria-label="deselect"
                      size="small"
                      onClick={(ev) => {
                        ev.stopPropagation();
                        const next = roles.find((x) => x.id !== r.id)?.id || roles[0].id;
                        setSelectedRole(next);
                      }}
                      sx={{ ml: 1 }}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  )}
                </Paper>
              </Grid>
            );
          })}
        </Grid>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {fileMeta ? (
            <Paper sx={{ p: 1.25, borderRadius: 1.5, display: "flex", alignItems: "center", gap: 1.25, bgcolor: "#fbfcff" }}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.4, minWidth: 0 }}>
                <Typography sx={{ fontWeight: 800, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 360, fontSize: 13 }}>
                  {fileMeta.name}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11 }}>
                  {formatBytes(fileMeta.size)} • {fileMeta.type || "Unknown type"} • {selectedRole}
                </Typography>
              </Box>

              <Box sx={{ flex: 1 }} />

              <Chip label={uploading ? `Uploading ${progress}%` : "Ready"} color={uploading ? "primary" : "default"} size="small" />
            </Paper>
          ) : (
            <Paper sx={{ p: 1.25, borderRadius: 1.5, bgcolor: "#fcfdff" }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
                No file selected. Use Choose File to upload.
              </Typography>
            </Paper>
          )}

          {uploading && (
            <Box sx={{ width: "100%", mt: 0.5 }}>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                  height: 8,
                  borderRadius: 1,
                  backgroundColor: "#eef3fb",
                  "& .MuiLinearProgress-bar": {
                    background: `linear-gradient(90deg, ${roleObj.color}, rgba(0,0,0,0.06))`,
                  },
                }}
              />
            </Box>
          )}
        </Box>
      </CardContent>

      <Snackbar open={snackbar.open} autoHideDuration={3800} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Card>
  );
}
