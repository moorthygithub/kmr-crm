import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Collapse,
} from "@mui/material";
import { NavLink } from "react-router-dom";
import { useMediaQuery } from "@mui/material";
import Dashboard from "../../Icons/Dashboard";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import CustomListItem from "./CustomListItem";
import MasterSvg from "../../Icons/Master";
import Traders from "../../Icons/Traders";
import mainLogo from "../../Icons/Mainlogo.jpg";
import Header from "../Navabar/Navbar";

<Box
  component="img"
  src={mainLogo}
  alt="Main Logo"
  sx={{ width: "100%", maxWidth: "300px" }}
/>;

const Sidebar = ({
  isCollapsed,
  handleDrawerToggle,
  openDrawer,
  setIsCollapsed,
  setOpenMasterMenu,
  openMasterMenu,
  openTradersMenu,
  setOpenTradersMenu,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(null);
  // const [openMasterMenu, setOpenMasterMenu] = useState(false);
  // const [openTradersMenu, setOpenTradersMenu] = useState(false);
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const isMediumScreen = useMediaQuery((theme) =>
    theme.breakpoints.between("md")
  );

  const handleListItemClick = (index) => {
    setSelectedIndex(index);
    if (isSmallScreen) {
      handleDrawerToggle();
    }
    if (!isSmallScreen && isMediumScreen) {
      setIsCollapsed((prev) => !prev);
    }
  };

  const toggleMasterMenu = () => {
    setOpenMasterMenu((prev) => !prev);
    setOpenTradersMenu(false);
  };

  const toggleTradersMenu = () => {
    setOpenTradersMenu((prev) => !prev);
    setOpenMasterMenu(false);
  };

  const handleDrawerForMaster = (e) => {
    e.stopPropagation();
    handleDrawerToggle();
    setOpenMasterMenu(false);
  };

  const handleDrawerForTrade = (e) => {
    e.stopPropagation();
    handleDrawerToggle();
    setOpenTradersMenu(false);
  };

  const hadleDashbord = () => {
    handleDrawerToggle();
    setOpenTradersMenu(false);
    setOpenMasterMenu(false);
    handleListItemClick(0);
  };
  return (
    <Drawer
      variant={isSmallScreen ? "temporary" : "permanent"}
      open={isSmallScreen ? openDrawer : true}
      onClose={isSmallScreen ? handleDrawerToggle : undefined}
      sx={{
        width: isSmallScreen ? 260 : isCollapsed ? 60 : 260,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: isSmallScreen ? 260 : isCollapsed ? 60 : 260,
          boxSizing: "border-box",
          overflowX: "hidden",
          marginTop: isSmallScreen ? 0 : "104px",
          border: "none",
          boxShadow: "none",
          transition: "width 0.3s ease",
          // backgroundColor:"#CDE8E5"
          backgroundImage:
            "url('https://itmeo.imgix.net/Defaults/landing/BG_desktop.jpg?auto=format&auto=compress&width=1491')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        },
      }}
    >
      <List>
        <Box
          component="img"
          src={mainLogo}
          alt="Main Logo"
          sx={{
            display: isSmallScreen ? "flex" : "none",
            justifyContent: "center",
            alignContent: "center",
            alignItems: "center",
            mb: 2,

            maxWidth: "8.5rem",
          }}
        ></Box>

        <CustomListItem
          button
          isSelected={selectedIndex === 0}
          onClick={hadleDashbord}
          component={NavLink}
          to="/dashboard"
          isCollapsed={isCollapsed}
        >
          <ListItemIcon>
            <Dashboard />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </CustomListItem>

        <CustomListItem
          style={{ cursor: "pointer" }}
          onClick={toggleMasterMenu}
        >
          <ListItemIcon onClick={handleDrawerForMaster}>
            <MasterSvg />
          </ListItemIcon>
          <ListItemText primary="Master" />
          {openMasterMenu ? <ExpandLess /> : <ExpandMore />}
        </CustomListItem>

        <Collapse in={openMasterMenu} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <CustomListItem
              button
              onClick={() => handleListItemClick(1)}
              component={NavLink}
              to="/register/category"
              sx={{ pl: 4 }}
            >
              <ListItemText primary="Category" />
            </CustomListItem>
            <CustomListItem
              button
              onClick={() => handleListItemClick(2)}
              component={NavLink}
              to="/subcategory"
              sx={{ pl: 4 }}
            >
              <ListItemText primary="SubCategory" />
            </CustomListItem>
            <CustomListItem
              button
              onClick={() => handleListItemClick(3)}
              component={NavLink}
              to="/news"
              sx={{ pl: 4 }}
            >
              <ListItemText primary="News" />
            </CustomListItem>
            <CustomListItem
              button
              onClick={() => handleListItemClick(4)}
              component={NavLink}
              to="/vendor"
              sx={{ pl: 4 }}
            >
              <ListItemText primary="Vendor" />
            </CustomListItem>
            <CustomListItem
              button
              onClick={() => handleListItemClick(5)}
              component={NavLink}
              to="/vendoruser"
              sx={{ pl: 4 }}
            >
              <ListItemText primary="VendorUser" />
            </CustomListItem>
          </List>
        </Collapse>

        {/* Traders Menu */}
        <CustomListItem
          style={{ cursor: "pointer" }}
          onClick={toggleTradersMenu}
        >
          <ListItemIcon onClick={handleDrawerForTrade}>
            <Traders />
          </ListItemIcon>
          <ListItemText primary="Traders" />
          {openTradersMenu ? <ExpandLess /> : <ExpandMore />}
        </CustomListItem>

        <Collapse in={openTradersMenu} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <CustomListItem
              button
              component={NavLink}
              to="/traders/live"
              sx={{ pl: 4 }}
              onClick={() => handleListItemClick(6)}
            >
              <ListItemText primary="Live" />
            </CustomListItem>
            <CustomListItem
              button
              component={NavLink}
              to="/traders/rates"
              sx={{ pl: 4 }}
              onClick={() => handleListItemClick(7)}
            >
              <ListItemText primary="Rates" />
            </CustomListItem>
            <CustomListItem
              button
              component={NavLink}
              to="/traders/spotrates"
              sx={{ pl: 4 }}
              onClick={() => handleListItemClick(8)}
            >
              <ListItemText primary="Spot Rates" />
            </CustomListItem>
          </List>
        </Collapse>
      </List>
    </Drawer>
  );
};

export default Sidebar;
