import React, { useState } from "react";
import { Box, CssBaseline } from "@mui/material";
import Header from "../Navabar/Navbar";
import Sidebar from "../Sidebar/Sidebar";
import { Outlet } from "react-router-dom";
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const Layout = () => {
  const theme = useTheme();
  const [openMasterMenu, setOpenMasterMenu] = useState(false);
  const [openTradersMenu, setOpenTradersMenu] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);

  const handleLeftDrawerToggle = () => {
    setIsCollapsed((prev) => !prev);
    setOpenDrawer((prev) => !prev);
    setOpenTradersMenu();
    setOpenMasterMenu();
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        overflowX: "hidden",
        overflowY: "auto",
      }}
    >
      <CssBaseline />
      <Header handleLeftDrawerToggle={handleLeftDrawerToggle} />
      <Box
        sx={{
          display: "flex",
          flex: 1,
        }}
      >
        <Sidebar
          isCollapsed={isCollapsed}
          handleDrawerToggle={handleLeftDrawerToggle}
          setOpenMasterMenu={setOpenMasterMenu}
          setOpenTradersMenu={setOpenTradersMenu}
          openTradersMenu={openTradersMenu}
          openMasterMenu={openMasterMenu}
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
