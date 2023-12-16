import { Box, Stack, Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import "./getstarted.css";

export default function GetOverStarted() {
  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      className="main__container"
    >
      <Stack spacing={2} justifyContent="center" alignItems="center">
        <Typography variant="h3">Welcome to TripTix System</Typography>
        <Typography variant="h4" color="red">
          let login before go next
        </Typography>
        <Link to="/login-page">
          <button class="button-type1">
            <span class="btn-txt">Get started !</span>
          </button>
        </Link>
      </Stack>
    </Box>
  );
}
