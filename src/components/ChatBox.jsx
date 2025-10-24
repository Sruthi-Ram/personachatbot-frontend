// src/components/ChatBox.js
import React, { useState, useEffect, useRef, useMemo } from "react";
import axios from "axios";
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Stack,
  InputBase,
  IconButton,
  Tooltip,
  Chip,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import GavelIcon from "@mui/icons-material/Gavel";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import SendIcon from "@mui/icons-material/Send";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import AttachFileIcon from "@mui/icons-material/AttachFile";

const personaData = [
  { id: "HR", name: "HR", color: "#0f62fe", icon: <PersonIcon /> },
  { id: "Legal", name: "Legal", color: "#6f42c1", icon: <GavelIcon /> },
  { id: "L1", name: "L1", color: "#00a86b", icon: <SupportAgentIcon /> },
  { id: "L2", name: "L2", color: "#ff7a00", icon: <SupportAgentIcon /> },
];

function PersonaPill({ p, selected, onClick }) {
  return (
    <Paper
      onClick={onClick}
      elevation={selected ? 6 : 0}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        px: 1.25,
        py: 0.45,
        borderRadius: 999,
        cursor: "pointer",
        bgcolor: selected ? `${p.color}15` : "transparent",
        border: selected ? `1px solid ${p.color}33` : "1px solid rgba(0,0,0,0.04)",
        transition: "transform 160ms ease, box-shadow 160ms ease, background 160ms ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 6px 14px rgba(16,24,40,0.05)",
          bgcolor: selected ? `${p.color}18` : "rgba(15,99,255,0.04)",
        },
      }}
    >
      <Avatar
        sx={{
          bgcolor: selected ? p.color : "transparent",
          color: selected ? "#fff" : p.color,
          width: 34,
          height: 34,
          border: selected ? "none" : `1px solid ${p.color}33`,
        }}
      >
        {p.icon}
      </Avatar>
      <Typography variant="subtitle2" sx={{ fontWeight: 800, letterSpacing: 0.2, fontSize: 13 }}>
        {p.name}
      </Typography>
    </Paper>
  );
}

function MessageBubble({ m, isUser, color }) {
  const bg = isUser ? "linear-gradient(90deg, rgba(15,99,255,0.12), rgba(15,99,255,0.06))" : `${color}10`;
  const align = isUser ? "flex-end" : "flex-start";
  return (
    <Box sx={{ display: "flex", justifyContent: align, mb: 1 }}>
      <Box sx={{ maxWidth: "85%" }}>
        {!isUser && m.role !== "system" && (
          <Typography variant="caption" sx={{ color, fontWeight: 800, mb: 0.5 }}>
            {m.role}
          </Typography>
        )}
        <Paper
          elevation={1}
          sx={{
            p: 1.25,
            borderRadius: 2,
            background: bg,
            wordBreak: "break-word",
            transition: "transform 140ms ease, box-shadow 140ms ease",
            "&:hover": { transform: "translateY(-3px)", boxShadow: "0 10px 24px rgba(16,24,40,0.06)" },
          }}
        >
          <Typography variant="body2" sx={{ color: "text.primary", whiteSpace: "pre-wrap", fontSize: 14 }}>
            {m.content}
          </Typography>

          {m.attachments?.length > 0 && (
            <Box sx={{ mt: 1, display: "flex", gap: 1, flexWrap: "wrap" }}>
              {m.attachments.map((a, idx) => (
                <Chip
                  key={idx}
                  label={a.name}
                  size="small"
                  sx={{
                    bgcolor: "#f2f4f7",
                    borderRadius: 1,
                    px: 0.75,
                    py: 0.25,
                    cursor: "pointer",
                    fontSize: 12,
                    "&:hover": { boxShadow: "0 6px 12px rgba(16,24,40,0.06)" },
                  }}
                />
              ))}
            </Box>
          )}
        </Paper>

        <Typography variant="caption" sx={{ color: "text.secondary", mt: 0.5, display: "block", fontSize: 11 }}>
          {m.timestamp ? new Date(m.timestamp).toLocaleString() : ""}
        </Typography>
      </Box>
    </Box>
  );
}

export default function ChatBox() {
  const [role, setRole] = useState("HR");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), [messages, typing]);

  const personaMap = useMemo(() => Object.fromEntries(personaData.map((p) => [p.id, p])), []);

  const sendMessage = async (text) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const userMsg = { role: "user", content: trimmed, timestamp: new Date() };
    setMessages((s) => [...s, userMsg]);
    setInput("");
    setTyping(true);

    try {
      const res = await axios.post("http://localhost:8000/chat", { role, messages: [], user_input: trimmed });
      const assistantContent = res?.data?.content ?? "No response";
      setMessages((s) => [...s, { role, content: assistantContent, timestamp: new Date() }]);
    } catch (err) {
      console.error(err);
      setMessages((s) => [...s, { role: "system", content: "Server error. Try again.", timestamp: new Date() }]);
    } finally {
      setTyping(false);
    }
  };

  const uploadDocument = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("persona", role);

    setMessages((s) => [
      ...s,
      { role: "system", content: `Uploading ${file.name}...`, timestamp: new Date() },
    ]);

    try {
      const res = await axios.post("http://localhost:8000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const filename = res?.data?.filename || file.name;

      setMessages((s) => {
        const newMsgs = s.slice();
        const idx = newMsgs.map((m) => m.content).lastIndexOf(`Uploading ${file.name}...`);
        if (idx !== -1) {
          newMsgs[idx] = {
            role: "system",
            content: `File successfully uploaded: ${filename}`,
            timestamp: new Date(),
            attachments: [{ name: filename }],
          };
        } else {
          newMsgs.push({
            role: "system",
            content: `File successfully uploaded: ${filename}`,
            timestamp: new Date(),
            attachments: [{ name: filename }],
          });
        }
        return newMsgs;
      });
    } catch (err) {
      console.error("Upload failed:", err);
      setMessages((s) => [
        ...s,
        { role: "system", content: "Upload failed. Try again.", timestamp: new Date() },
      ]);
    } finally {
      e.target.value = "";
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        width: "100%",
        borderRadius: 2,
        p: { xs: 1.5, md: 2.5 },
        background: "transparent",
        boxShadow: "none",
        transition: "transform 160ms ease",
      }}
    >
      {/* Compact header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.25 }}>
        <Box sx={{ display: "flex", gap: 1.25, alignItems: "center", minWidth: 0 }}>
          <Avatar sx={{ bgcolor: "transparent", color: personaMap[role].color, width: 36, height: 36, fontSize: 14 }}>
            {personaMap[role].icon}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, fontSize: 15, lineHeight: 1 }}>
              {role === "user" ? "You" : role === "HR" || role === "Legal" ? personaMap[role].name : role}
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary", fontSize: 12 }}>
              {role === "HR" ? "HR assistant" : role === "Legal" ? "Legal assistant" : "Support persona"}
            </Typography>
          </Box>
        </Box>

        <Tooltip title="More">
          <IconButton
            size="small"
            sx={{
              bgcolor: "transparent",
              "&:hover": { bgcolor: "transparent", transform: "rotate(8deg)" },
              transition: "transform 160ms ease",
            }}
          >
            <MoreHorizIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      <Stack direction="row" spacing={1} sx={{ mb: 1.5, overflowX: "auto", pb: 0.5 }}>
        {personaData.map((p) => (
          <PersonaPill key={p.id} p={p} selected={role === p.id} onClick={() => setRole(p.id)} />
        ))}
      </Stack>

      <Paper
        elevation={0}
        sx={{
          height: 360,
          overflowY: "auto",
          p: 1.5,
          borderRadius: 1.5,
          border: "1px solid rgba(0,0,0,0.04)",
          mb: 1.5,
          background: "linear-gradient(180deg, rgba(255,255,255,0.6), rgba(250,251,255,0.4))",
          "&::-webkit-scrollbar": { height: 6, width: 6 },
          "&::-webkit-scrollbar-thumb": {
            background: "linear-gradient(180deg, rgba(0,0,0,0.06), rgba(0,0,0,0.03))",
            borderRadius: 6,
          },
          "&::-webkit-scrollbar-track": { background: "transparent" },
        }}
      >
        {messages.length === 0 && !typing ? (
          <Box sx={{ height: "100%", display: "grid", placeItems: "center", color: "text.secondary" }}>
            <Typography sx={{ fontWeight: 700, textAlign: "center" }}>
              Start a conversation with{" "}
              <Box component="span" sx={{ color: personaMap[role].color, fontWeight: 900 }}>
                {personaMap[role].name}
              </Box>
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {messages.map((m, i) => (
              <MessageBubble key={i} m={m} isUser={m.role === "user"} color={personaMap[m.role]?.color ?? "#6f42c1"} />
            ))}

            {typing && (
              <Box sx={{ display: "flex", justifyContent: "flex-start", mb: 1 }}>
                <Paper
                  sx={{
                    p: 0.9,
                    borderRadius: 2,
                    background: `${personaMap[role].color}22`, // stronger, more visible typing bg
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Typography variant="body2" sx={{ color: personaMap[role].color, fontWeight: 800, fontSize: 13 }}>
                    {personaMap[role].name} is typing
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      gap: 0.4,
                      alignItems: "center",
                      ml: 0.4,
                      "& span": {
                        width: 6,
                        height: 6,
                        bgcolor: `${personaMap[role].color}`,
                        borderRadius: "50%",
                        opacity: 0.95,
                        animation: "typingDot 0.95s infinite",
                      },
                      "& span:nth-of-type(2)": { animationDelay: "0.12s", opacity: 0.75 },
                      "& span:nth-of-type(3)": { animationDelay: "0.24s", opacity: 0.55 },
                      "@keyframes typingDot": {
                        "0%": { transform: "translateY(0)", opacity: 0.2 },
                        "50%": { transform: "translateY(-5px)", opacity: 1 },
                        "100%": { transform: "translateY(0)", opacity: 0.2 },
                      },
                    }}
                  >
                    <span />
                    <span />
                    <span />
                  </Box>
                </Paper>
              </Box>
            )}

            <div ref={bottomRef} />
          </Box>
        )}
      </Paper>

      <Box
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage(input);
        }}
        sx={{
          display: "flex",
          gap: 0.75,
          alignItems: "center",
          background: "#f3f7ff", // slightly darker than before for contrast
          p: 0.9,
          borderRadius: 2,
          border: "1px solid rgba(15,99,255,0.08)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6)",
          transition: "box-shadow 140ms ease, transform 140ms ease",
          "&:hover": { boxShadow: "0 8px 22px rgba(15,99,255,0.06)" },
          "&:focus-within": { boxShadow: "0 12px 30px rgba(15,99,255,0.10)", transform: "translateY(-2px)" },
        }}
      >
        <InputBase
          placeholder={`Message ${role}...`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          sx={{
            ml: 1,
            flex: 1,
            multiline: true,
            "& .MuiInputBase-input": { fontSize: 13, lineHeight: "18px" },
            background: "transparent",
            px: 1,
            py: 0.4,
            borderRadius: 1.5,
          }}
          multiline
          maxRows={4}
        />

        <input ref={fileInputRef} id="chat-file" type="file" hidden onChange={uploadDocument} />
        <Tooltip title="Attach document">
          <IconButton
            onClick={() => fileInputRef.current?.click()}
            sx={{
              borderRadius: 1.5,
              color: "text.secondary",
              "&:hover": { bgcolor: "rgba(15,99,255,0.06)", color: "primary.main" },
            }}
            size="small"
          >
            <AttachFileIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Send">
          <IconButton
            onClick={() => sendMessage(input)}
            sx={{
              bgcolor: "primary.main",
              color: "#fff",
              "&:hover": { bgcolor: "primary.dark", transform: "translateY(-2px)", boxShadow: "0 8px 20px rgba(15,99,255,0.18)" },
              borderRadius: 1.5,
              p: 0.9,
            }}
            size="small"
          >
            <SendIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    </Paper>
  );
}
