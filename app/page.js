"use client";
import React, { useState, useEffect, useCallback } from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import { kanit, roboto_mono } from "./fonts.js";
import {
  ThemeProvider,
  createTheme,
  Avatar,
  Popover,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import ChatBot from "./components/ChatBot.js";
import WelcomePage from "./components/WelcomePage.js";
import { UserAuth } from "./context/UserContext.js";
import { firestore } from "../firebase";
import {
  collection,
  doc,
  addDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  getDocs,
} from "firebase/firestore";

const drawerWidth = 240;
const fontTheme = createTheme({
  typography: {
    fontFamily: kanit.style.fontFamily,
  },
});

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

export default function HomePage() {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const { user, googleLogin, logOut, loading } = UserAuth();
  const [conversations, setConversations] = useState([]); // State to store conversations for the names
  const [selectedConversation, setSelectedConversation] = useState(null); // State to store the conversation users selected from the side bar
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleNewConversation = () => {
    setSelectedConversation({
      conversation: [],
      id: null, // Resetting ID as it's a new conversation
    });
  };

  const handleAddConversation = (newConversation) => {
    setConversations((prevConversations) => [
      ...prevConversations,
      newConversation,
    ]);
  };

  const fetchConversations = useCallback(async () => {
    if (user) {
      const userDocRef = doc(firestore, "users", user.uid);
      const conversationsRef = collection(userDocRef, "conversations");
      const querySnapshot = await getDocs(conversationsRef);
      const convos = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setConversations(convos);
    }
  }, [user]);

  useEffect(() => {
    if (!loading && user) {
      fetchConversations();
    }
  }, [loading, user, fetchConversations]);

  const handleConversationClick = (conversation) => {
    setSelectedConversation(conversation);
    console.log(conversation);
  };

  return (
    <ThemeProvider theme={fontTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="fixed" open={open}>
          <Toolbar>
            {user ? (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={() => {
                  handleDrawerOpen();
                  fetchConversations();
                }}
                edge="start"
                sx={{ mr: 0, ...(open && { display: "none" }) }}
              >
                <MenuIcon />
              </IconButton>
            ) : null}
            {user ? (
              <IconButton
                color="inherit"
                aria-label="start new conversation"
                onClick={handleNewConversation}
              >
                <BorderColorIcon color="action" />
              </IconButton>
            ) : null}
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ flexGrow: 1 }}
            >
              Travel Assistant Bot
            </Typography>
            {user == null ? (
              <Button color="inherit" onClick={googleLogin}>
                Login
              </Button>
            ) : (
              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Logout">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt="Profile Picture" src={user.photoURL} />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <MenuItem onClick={logOut}>
                    <Typography textAlign="center">Log Out</Typography>
                  </MenuItem>
                </Menu>
              </Box>
            )}
          </Toolbar>
        </AppBar>
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
          variant="persistent"
          anchor="left"
          open={open}
        >
          <DrawerHeader>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "ltr" ? (
                <ChevronLeftIcon />
              ) : (
                <ChevronRightIcon />
              )}
            </IconButton>
          </DrawerHeader>
          <Divider />
          <List>
            {conversations.map((conversation) => (
              <ListItem
                key={conversation.id}
                disablePadding
                button
                onClick={() => handleConversationClick(conversation)}
              >
                <ListItemButton>
                  <ListItemIcon>
                    <QuestionAnswerIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={conversation.name || "Unnamed Conversation"}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Drawer>
        <Main open={open}>
          <DrawerHeader />
          {user ? (
            <ChatBot
              conversation={selectedConversation} // Pass selected conversation to ChatBot
            />
          ) : (
            <WelcomePage />
          )}
        </Main>
      </Box>
    </ThemeProvider>
  );
}
