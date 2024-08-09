"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Stack,
  Button,
  TextField,
  Typography,
  CssBaseline,
  ThemeProvider,
  createTheme,
  Avatar,
} from "@mui/material";
import { inter, roboto_mono, kanit } from "./fonts.js";
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth, firestore } from "../firebase.js";
import ButtonAppBar from "./components/NavBar.js";
import { UserAuth } from "./context/UserContext.js";

const theme = createTheme({
  typography: {
    fontFamily: kanit.style.fontFamily,
  },
});

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi, I'm your travel assistant! How can I help you today?",
    },
  ]);
  const [message, setMessage] = useState("");
  const { user } = UserAuth();

  const sendMessage = async () => {
    const userMessage = message.trim();
    if (!userMessage) return; // Prevent sending empty messages

    setMessage(""); // Clear the input field
    setMessages((messages) => [
      ...messages,
      { role: "user", content: userMessage }, // Add the user's message to the chat
      { role: "assistant", content: "Typing..." }, // Add a placeholder for the assistant's response
    ]);

    try {
      // Send the message to the server
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage }), // Send only the user's message
      });

      const data = await response.json();
      console.log("Response from API:", data);

      setMessages((messages) => {
        let lastMessage = messages[messages.length - 1]; // Get the last message (assistant's placeholder)
        let otherMessages = messages.slice(0, messages.length - 1); // Get all other messages
        return [
          ...otherMessages,
          { ...lastMessage, content: formatMessage(data.response) }, // Format and set the assistant's message
        ];
      });
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((messages) => [
        ...messages.slice(0, messages.length - 1), // Remove the placeholder
        { role: "assistant", content: "Error communicating with the server." },
      ]);
    }
  };

  const formatMessage = (message) => {
    // Remove unwanted characters and format the message
    return message
      .replace(/\\n/g, "\n") // Replace newline characters
      .replace(/{"response":"|"}$/g, "") // Remove JSON artifacts
      .trim();
  };

  return (
    <ThemeProvider theme={theme}>
      <ButtonAppBar />
      <Box
        sx={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: "white",
          overflow: "auto",
        }}
      >
        <CssBaseline />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mt: 2,
            mb: 2,
          }}
        >
          <Typography
            variant="h3"
            align="center"
            sx={{ color: "black", mt: -3, mb: 2 }}
          >
            Welcome to Your Travel Assistant
          </Typography>
          {/* <Button onClick={googleLogin}>Sign In</Button> */}
        </Box>
        <Box
          sx={{
            width: { xs: "90%", sm: "80%", md: "500px" },
            height: { xs: "60vh", sm: "70vh", md: "550px" },
            border: "1px solid black",
            display: "flex",
            flexDirection: "column",
            // p: 2,
            overflowY: "auto",
            mb: 1,
          }}
        >
          <Stack direction={"column"} spacing={2} flexGrow={1}>
            <Box bgcolor={"blue"}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  p: 2,
                }}
              >
                <Avatar
                  alt="Bot Image"
                  src="https://cdn-icons-png.flaticon.com/512/4712/4712038.png"
                  sx={{ marginRight: "12px" }}
                ></Avatar>
                <Box>
                  <Typography>TravelBot</Typography>
                  <Typography>We're online</Typography>
                </Box>
              </Box>
            </Box>
            {messages.map((message, index) => (
              <Box
                key={index}
                display="flex"
                justifyContent={
                  message.role === "assistant" ? "flex-start" : "flex-end"
                }
                sx={{ p: 2, marginBottom: "10px" }}
              >
                <Box
                  bgcolor={
                    message.role === "assistant"
                      ? "primary.main"
                      : "secondary.main"
                  }
                  color="white"
                  borderRadius={12}
                  p={2}
                >
                  <Typography>{message.content}</Typography>
                </Box>
              </Box>
            ))}
          </Stack>
          <Stack direction={"row"} spacing={2} padding={2}>
            <TextField
              label="Message"
              fullWidth
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
            />
            <Button variant="contained" onClick={sendMessage}>
              Send
            </Button>
          </Stack>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
