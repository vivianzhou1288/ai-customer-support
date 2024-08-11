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
import { kanit } from "../fonts.js";
// import ButtonAppBar from "./components/NavBar.js";
import { UserAuth } from "../context/UserContext.js";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { firestore } from "../../firebase.js";
import LoadingPage from "./LoadingPage.js";
import {
  collection,
  doc,
  addDoc,
  deleteDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";

const theme = createTheme({
  typography: {
    fontFamily: kanit.style.fontFamily,
  },
});

export default function ChatBot({ conversation, onAddConversation }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi, I'm your travel assistant! How can I help you today?",
    },
  ]);
  const [message, setMessage] = useState("");
  const [conversationId, setConversationId] = useState(null);
  const { user, loading } = UserAuth();
  const [isBookmarked, setIsBookmarked] = useState(false);

  // useEffect(() => {
  //   if (!loading && conversation) {
  //     setMessages(conversation.conversation || []);
  //     setConversationId(conversation.id);
  //     setIsBookmarked(true);
  //   } else {
  //     setIsBookmarked(false);
  //   }
  // }, [conversation]);

  useEffect(() => {
    if (!loading && conversation) {
      if (conversation.conversation.length > 0) {
        setMessages(conversation.conversation);
        setIsBookmarked(true);
      } else {
        setMessages([
          {
            role: "assistant",
            content: "Hi, I'm your travel assistant! How can I help you today?",
          },
        ]);
        setIsBookmarked(false);
      }
      setConversationId(conversation.id);
    } else {
      setIsBookmarked(false);
    }
  }, [conversation]);

  const saveConversationToFirebase = async (conversation, userId, name) => {
    try {
      // Reference to the user's document
      const userDocRef = doc(firestore, "users", userId);

      // Add a new conversation document in the 'conversations' subcollection
      const conversationRef = await addDoc(
        collection(userDocRef, "conversations"),
        {
          name: name,
          conversation: conversation,
          timestamp: new Date(),
        }
      );

      console.log(
        "Conversation bookmarked successfully with ID: ",
        conversationRef.id
      );
      return conversationRef.id; // Return the ID of the new conversation document
    } catch (error) {
      console.error("Error bookmarking conversation: ", error);
    }
  };

  const deleteConversationFromFirebase = async (conversationId, userId) => {
    try {
      const conversationDocRef = doc(
        firestore,
        "users",
        userId,
        "conversations",
        conversationId
      );
      await deleteDoc(conversationDocRef);
      console.log("Conversation deleted successfully!");
    } catch (error) {
      console.error("Error deleting conversation: ", error);
    }
  };

  const handleBookmarkToggle = async () => {
    if (!user) {
      console.log("User is not logged in");
      return;
    }

    if (isBookmarked) {
      // If the conversation is already bookmarked, delete it
      if (conversationId) {
        await deleteConversationFromFirebase(conversationId, user.uid);
        setConversationId(null);
      }
      setIsBookmarked(false);
    } else {
      // If the conversation is not bookmarked, save it
      const name = messages[0]?.content || "New Conversation";
      const newConversationId = await saveConversationToFirebase(
        messages,
        user.uid,
        name
      );
      setConversationId(newConversationId);
      setIsBookmarked(true);
    }
  };

  const updateBookmarkedConversation = async (
    userId,
    conversationId,
    newMessage
  ) => {
    try {
      // Reference to the specific conversation document in the 'conversations' subcollection
      const conversationDocRef = doc(
        firestore,
        "users",
        userId,
        "conversations",
        conversationId
      );

      // Update the conversation document by appending the new message
      await updateDoc(conversationDocRef, {
        conversation: arrayUnion(newMessage),
        lastUpdated: new Date(),
      });

      console.log("Conversation updated successfully!");
    } catch (error) {
      console.error("Error updating conversation: ", error);
    }
  };

  const sendMessage = async () => {
    const userMessage = message.trim();
    if (!userMessage) return; // Prevent sending empty messages

    setMessage(""); // Clear the input field
    const newMessage = { role: "user", content: userMessage };
    setMessages((messages) => [
      ...messages,
      newMessage,
      { role: "assistant", content: "Typing..." },
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
      const assistantMessage = {
        role: "assistant",
        content: formatMessage(data.response),
      };
      console.log("Response from API:", data);

      setMessages((messages) => {
        let lastMessage = messages[messages.length - 1]; // Get the last message (assistant's placeholder)
        let otherMessages = messages.slice(0, messages.length - 1); // Get all other messages
        return [...otherMessages, assistantMessage];
      });

      if (user && isBookmarked && conversationId) {
        await updateBookmarkedConversation(
          user.uid,
          conversationId,
          newMessage
        );
        await updateBookmarkedConversation(
          user.uid,
          conversationId,
          assistantMessage
        );
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((messages) => [
        ...messages.slice(0, messages.length - 1),
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

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <ThemeProvider theme={theme}>
      {/* <ButtonAppBar /> */}
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
                  justifyContent: "space-between",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
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
                <Button>
                  <BookmarkIcon
                    color={isBookmarked ? "warning" : "secondary"}
                    onClick={handleBookmarkToggle}
                  />
                </Button>
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
