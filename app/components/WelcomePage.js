"use client";
import React, { useEffect, useState } from "react";
import {
  Button,
  Typography,
  Container,
  Box,
  Grid,
  createTheme,
  ThemeProvider,
  CssBaseline,
} from "@mui/material";
import { UserAuth } from "../context/UserContext";
import { kanit } from "../fonts.js";

const theme = createTheme({
  typography: {
    fontFamily: kanit.style.fontFamily,
  },
});

const WelcomePage = () => {
  const { googleLogin } = UserAuth();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container
        maxWidth="xl"
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "white",
          color: "black",
        }}
      >
        <Box textAlign="center">
          <Typography
            variant="h4"
            gutterBottom
            sx={{ textAlign: "center", marginBottom: "10px" }}
          >
            Welcome to Your Travel Assistant.
          </Typography>
          <Typography sx={{ textAlign: "center", marginBottom: "20px" }}>
            Have questions about your travel destinations. Ask our Travel
            Assistant Bot for help!
          </Typography>
          <Box sx={{ marginBottom: "20px" }}>
            <Button variant="contained" color="primary" onClick={googleLogin}>
              Login with Google
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default WelcomePage;
