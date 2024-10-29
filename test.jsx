import React, { useState } from "react";
import { Box, CssBaseline } from "@mui/material";
import Header from "../Navabar/Navbar";
import Sidebar from "../Sidebar/Sidebar";
import { Outlet } from "react-router-dom";
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const Layout = () => {
  const theme = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);

  const handleLeftDrawerToggle = () => {
    setIsCollapsed((prev) => !prev);
    setOpenDrawer((prev) => !prev);
  };

 

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        overflowX: "hidden",
      }}
    >
      <CssBaseline />
      <Header
        handleLeftDrawerToggle={handleLeftDrawerToggle}
        sx={{
          position: "fixed", // Fix the header at the top
          top: 0,
          left: 0,
          right: 0,
          zIndex: theme.zIndex.drawer + 1, // Ensure the header is above the sidebar and content
          height: headerHeight,
        }}
      />
      <Box
        sx={{
          display: "flex",
          flex: 1,
          marginTop: headerHeight, // Push content down to make space for the fixed header
        }}
      >
        <Sidebar
          isCollapsed={isCollapsed}
          handleDrawerToggle={handleLeftDrawerToggle}
          openDrawer={openDrawer}
        />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 2,
            transition: "margin-left 0.3s ease",
            width: `calc(100% - ${isCollapsed ? "60px" : "260px"})`,
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
