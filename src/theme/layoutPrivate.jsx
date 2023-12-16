import React from "react";
import SidebarCustom from "./sibarCustom";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";

const Layout = () => {
  return (
    <Box>
      <SidebarCustom />
      <Box
        sx={{
          ml: "251px",
          p: "20px",
          pt: "100px",
          overflowY: "auto",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};
export default Layout;
