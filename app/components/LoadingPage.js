"use client";
import React from "react";
import { Box, CircularProgress } from "@mui/material";

const LoadingPage = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "white",
      }}
    >
      <CircularProgress size={60} color="primary" />
    </Box>
  );
};

export default LoadingPage;
