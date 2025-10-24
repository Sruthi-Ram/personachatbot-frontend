// src/components/MessageBubble.js
import React from "react";
import { Box, Paper, Typography, Avatar, Stack } from "@mui/material";

const personaColors = {
  Mentor: "#3a8dff",
  Analyst: "#6c757d",
  Assistant: "#198754",
  Coach: "#fd7e14",
};

export default function MessageBubble({ role, content }) {
  const isUser = role === "user";
  const bubbleColor = isUser ? "#e9f2ff" : role === "system" ? "#fff3cd" : "#f1f3f5";
  const textColor = "#0f1724";
  const align = isUser ? "flex-end" : "flex-start";
  const textAlign = isUser ? "right" : "left";

  const showPersonaBadge = !isUser && role !== "system" && personaColors[role];

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: align,
        mb: 1.5,
        px: { xs: 1, sm: 2 },
      }}
    >
      <Box
        sx={{
          maxWidth: { xs: "92%", sm: "78%", md: "72%" },
          width: "100%",
          display: "flex",
          flexDirection: isUser ? "row-reverse" : "row",
          gap: 1.5,
          alignItems: "flex-start",
        }}
      >
        {/* Optional avatar / badge column */}
        {showPersonaBadge && (
          <Avatar
            sx={{
              bgcolor: personaColors[role],
              color: "#fff",
              width: 40,
              height: 40,
              fontWeight: 700,
              boxShadow: "0 6px 18px rgba(15,23,36,0.06)",
              flexShrink: 0,
            }}
            aria-hidden
          >
            {role.charAt(0)}
          </Avatar>
        )}

        <Box sx={{ flex: 1, minWidth: 0 }}>
          {/* Role label (compact badge) */}
          {showPersonaBadge && (
            <Typography
              variant="caption"
              sx={{
                color: personaColors[role],
                fontWeight: 700,
                display: "inline-block",
                mb: 0.5,
                letterSpacing: 0.2,
              }}
            >
              {role}
            </Typography>
          )}

          <Paper
            sx={{
              p: { xs: 1, sm: 1.25 },
              borderRadius: 2,
              bgcolor: bubbleColor,
              color: textColor,
              textAlign: textAlign,
              boxShadow: "0 6px 18px rgba(15,23,36,0.06)",
              border: "1px solid rgba(15,23,36,0.04)",
              transition: "transform 180ms cubic-bezier(.2,.9,.2,1), box-shadow 180ms ease",
              "&:hover": { transform: "translateY(-3px)", boxShadow: "0 14px 36px rgba(15,23,36,0.10)" },
            }}
            tabIndex={0}
            role="article"
            aria-label={`message from ${role}`}
          >
            <Typography
              variant="body1"
              sx={{
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                lineHeight: 1.5,
                fontSize: { xs: 14, sm: 15 },
              }}
            >
              {content}
            </Typography>

            {/* small metadata placeholder (keeps layout consistent but empty by default) */}
            <Stack
              direction="row"
              spacing={1}
              justifyContent={isUser ? "flex-end" : "flex-start"}
              sx={{ mt: 1 }}
            >
              <Typography variant="caption" color="text.secondary" sx={{ mr: 0.5 }}>
                {/* intentionally left blank for now; add timestamp/status if needed */}
              </Typography>
            </Stack>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}
