"use client";
// import React, { useState } from "react";
// import {
//   Box,
//   Stack,
//   Button,
//   TextField,
//   Typography,
//   CssBaseline,
//   ThemeProvider,
//   createTheme,
//   Avatar,
// } from "@mui/material";
// import { kanit } from "./fonts.js";
// import ButtonAppBar from "./components/NavBar.js";
// import { UserAuth } from "./context/UserContext.js";

// const theme = createTheme({
//   typography: {
//     fontFamily: kanit.style.fontFamily,
//   },
// });

// export default function Home() {
//   const [messages, setMessages] = useState([
//     {
//       role: "assistant",
//       content: "Hi, I'm your travel assistant! How can I help you today?",
//     },
//   ]);
//   const [message, setMessage] = useState("");
//   const { user } = UserAuth();

//   const sendMessage = async () => {
//     const userMessage = message.trim();
//     if (!userMessage) return; // Prevent sending empty messages

//     setMessage(""); // Clear the input field
//     setMessages((messages) => [
//       ...messages,
//       { role: "user", content: userMessage }, // Add the user's message to the chat
//       { role: "assistant", content: "Typing..." }, // Add a placeholder for the assistant's response
//     ]);

//     try {
//       // Send the message to the server
//       const response = await fetch("/api/chat", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ message: userMessage }), // Send only the user's message
//       });

//       const data = await response.json();
//       console.log("Response from API:", data);

//       setMessages((messages) => {
//         let lastMessage = messages[messages.length - 1]; // Get the last message (assistant's placeholder)
//         let otherMessages = messages.slice(0, messages.length - 1); // Get all other messages
//         return [
//           ...otherMessages,
//           { ...lastMessage, content: formatMessage(data.response) }, // Format and set the assistant's message
//         ];
//       });
//     } catch (error) {
//       console.error("Error sending message:", error);
//       setMessages((messages) => [
//         ...messages.slice(0, messages.length - 1), // Remove the placeholder
//         { role: "assistant", content: "Error communicating with the server." },
//       ]);
//     }
//   };

//   const formatMessage = (message) => {
//     // Remove unwanted characters and format the message
//     return message
//       .replace(/\\n/g, "\n") // Replace newline characters
//       .replace(/{"response":"|"}$/g, "") // Remove JSON artifacts
//       .trim();
//   };

//   return (
//     <ThemeProvider theme={theme}>
//       <ButtonAppBar />
//       <Box
//         sx={{
//           width: "100vw",
//           height: "100vh",
//           display: "flex",
//           flexDirection: "column",
//           justifyContent: "center",
//           alignItems: "center",
//           bgcolor: "white",
//           overflow: "auto",
//         }}
//       >
//         <CssBaseline />
//         <Box
//           sx={{
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//             mt: 2,
//             mb: 2,
//           }}
//         >
//           <Typography
//             variant="h3"
//             align="center"
//             sx={{ color: "black", mt: -3, mb: 2 }}
//           >
//             Welcome to Your Travel Assistant
//           </Typography>
//           {/* <Button onClick={googleLogin}>Sign In</Button> */}
//         </Box>
//         <Box
//           sx={{
//             width: { xs: "90%", sm: "80%", md: "500px" },
//             height: { xs: "60vh", sm: "70vh", md: "550px" },
//             border: "1px solid black",
//             display: "flex",
//             flexDirection: "column",
//             // p: 2,
//             overflowY: "auto",
//             mb: 1,
//           }}
//         >
//           <Stack direction={"column"} spacing={2} flexGrow={1}>
//             <Box bgcolor={"blue"}>
//               <Box
//                 sx={{
//                   display: "flex",
//                   flexDirection: "row",
//                   alignItems: "center",
//                   p: 2,
//                 }}
//               >
//                 <Avatar
//                   alt="Bot Image"
//                   src="https://cdn-icons-png.flaticon.com/512/4712/4712038.png"
//                   sx={{ marginRight: "12px" }}
//                 ></Avatar>
//                 <Box>
//                   <Typography>TravelBot</Typography>
//                   <Typography>We're online</Typography>
//                 </Box>
//               </Box>
//             </Box>
//             {messages.map((message, index) => (
//               <Box
//                 key={index}
//                 display="flex"
//                 justifyContent={
//                   message.role === "assistant" ? "flex-start" : "flex-end"
//                 }
//                 sx={{ p: 2, marginBottom: "10px" }}
//               >
//                 <Box
//                   bgcolor={
//                     message.role === "assistant"
//                       ? "primary.main"
//                       : "secondary.main"
//                   }
//                   color="white"
//                   borderRadius={12}
//                   p={2}
//                 >
//                   <Typography>{message.content}</Typography>
//                 </Box>
//               </Box>
//             ))}
//           </Stack>
//           <Stack direction={"row"} spacing={2} padding={2}>
//             <TextField
//               label="Message"
//               fullWidth
//               value={message}
//               onChange={(e) => setMessage(e.target.value)}
//               onKeyPress={(e) => {
//                 if (e.key === "Enter") {
//                   sendMessage();
//                 }
//               }}
//             />
//             <Button variant="contained" onClick={sendMessage}>
//               Send
//             </Button>
//           </Stack>
//         </Box>
//       </Box>
//     </ThemeProvider>
//   );
// }

import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import { kanit } from "./fonts.js";
import { ThemeProvider, createTheme } from "@mui/material";
import ChatBot from "./components/ChatBot.js";
import { Chat } from "@mui/icons-material";

const drawerWidth = 240;
const fontTheme = createTheme({
  typography: {
    fontFamily: kanit.style.fontFamily,
  },
});

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    // padding: theme.spacing(3),
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

export default function PersistentDrawerLeft() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <ThemeProvider theme={fontTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="fixed" open={open}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{ mr: 2, ...(open && { display: "none" }) }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              Persistent drawer
            </Typography>
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
            {["Inbox", "Starred", "Send email", "Drafts"].map((text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            {["All mail", "Trash", "Spam"].map((text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Drawer>
        <Main open={open}>
          <DrawerHeader />
          <ChatBot />
          {/* <Typography paragraph>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Rhoncus
            dolor purus non enim praesent elementum facilisis leo vel. Risus at
            ultrices mi tempus imperdiet. Semper risus in hendrerit gravida
            rutrum quisque non tellus. Convallis convallis tellus id interdum
            velit laoreet id donec ultrices. Odio morbi quis commodo odio aenean
            sed adipiscing. Amet nisl suscipit adipiscing bibendum est ultricies
            integer quis. Cursus euismod quis viverra nibh cras. Metus vulputate
            eu scelerisque felis imperdiet proin fermentum leo. Mauris commodo
            quis imperdiet massa tincidunt. Cras tincidunt lobortis feugiat
            vivamus at augue. At augue eget arcu dictum varius duis at
            consectetur lorem. Velit sed ullamcorper morbi tincidunt. Lorem
            donec massa sapien faucibus et molestie ac.
          </Typography>
          <Typography paragraph>
            Consequat mauris nunc congue nisi vitae suscipit. Fringilla est
            ullamcorper eget nulla facilisi etiam dignissim diam. Pulvinar
            elementum integer enim neque volutpat ac tincidunt. Ornare
            suspendisse sed nisi lacus sed viverra tellus. Purus sit amet
            volutpat consequat mauris. Elementum eu facilisis sed odio morbi.
            Euismod lacinia at quis risus sed vulputate odio. Morbi tincidunt
            ornare massa eget egestas purus viverra accumsan in. In hendrerit
            gravida rutrum quisque non tellus orci ac. Pellentesque nec nam
            aliquam sem et tortor. Habitant morbi tristique senectus et.
            Adipiscing elit duis tristique sollicitudin nibh sit. Ornare aenean
            euismod elementum nisi quis eleifend. Commodo viverra maecenas
            accumsan lacus vel facilisis. Nulla posuere sollicitudin aliquam
            ultrices sagittis orci a.
          </Typography> */}
        </Main>
      </Box>
    </ThemeProvider>
  );
}
