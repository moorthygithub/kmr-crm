import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Typography,
  Avatar,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SettingsIcon from "@mui/icons-material/Settings";
import { styled, alpha } from "@mui/material/styles";
// import Logo from "../../Icons/Berry";
import Profile from "../../Icons/Profile";
import AccountSetting from "../../Icons/AccountSetting";
import LogoutIcon from "../../Icons/LogoutIcon";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "@mui/material";
import mainLogo from "../../Icons/Mainlogo.jpg";

const HoverIconButton = styled(IconButton)({
  color: "rgb(94, 53, 177)",
  backgroundColor: alpha("rgb(94, 53, 177)", 0.1),
  borderRadius: "6px",
  "&:hover": {
    color: "white",
    backgroundColor: "rgb(94, 53, 177)",
  },
});

const HoverIconButton1 = styled(IconButton)({
  color: "rgb(33, 150, 243)",
  backgroundColor: alpha("rgb(50, 165, 249)", 0.1),
  borderRadius: "40px",
  "&:hover": {
    color: "rgb(227, 242, 253)",
    backgroundColor: "rgb(33, 150, 243)",
  },
});

const StyledMenu = styled(Menu)({
  "& .MuiMenu-paper": {
    paddingLeft: "4px",
    paddingRight: "4px",
  },
});

const StyledMenuItem = styled((props) => <MenuItem {...props} />)(
  ({ theme, isSelected }) => ({
    width: "311px",
    height: "60px",
    display: "flex",
    alignItems: "center",
    backgroundColor: isSelected ? alpha("#6200ee", 0.1) : "white",
    borderRadius: "5px",
    "&:hover": {
      backgroundColor: alpha("#6200ee", 0.1),
    },
  })
);

const Header = ({ handleLeftDrawerToggle ,toggleMasterMenu,toggleTradersMenu}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleMenuItemClick = (item) => {
    setSelectedItem(item);
    handleMenuClose();
  };

  const handleProfile = () => {
    handleMenuItemClick("profile");
    navigate("/profile");
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        // zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundImage:
          "url('https://itmeo.imgix.net/Defaults/landing/BG_desktop.jpg?auto=format&auto=compress&width=1491')",
        backgroundSize: "cover", 
        backgroundPosition: "center",
        color: "black",
        boxShadow:
          "rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset",
        padding: "16px",
      }}
    >
      <Toolbar>
        <Box
          component="img"
          src={mainLogo}
          alt="Main Logo"
          sx={{
            flexGrow: 0,
            justifyContent: "flex-start",
            display: isSmallScreen ? "none" : "flex",
            alignItems: "flex-start",
            // justifyContent: "center",
            // flexGrow: 0,
            maxWidth: "8.5rem",
            height: "3.5rem",
            mb: 2,
          }}
        />

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexGrow: 1,
            ml: isSmallScreen ? 0 : 15,
            justifyContent: isSmallScreen ? "flex-start" : "flex-end",
            gap: isSmallScreen ? "16px" : "0",
          }}
        >
          {isSmallScreen ? (
            <>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexGrow: 1,
                  gap: "16px",
                }}
              >
                <HoverIconButton
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  onClick={handleLeftDrawerToggle}
                >
                  <MenuIcon  />
                </HoverIconButton>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                }}
              >
                <HoverIconButton1
                  size="large"
                  aria-label="settings"
                  color="inherit"
                  onClick={handleMenuClick}
                  sx={{
                    padding: "5px",
                  }}
                >
                  <Avatar
                    sx={{
                      height: "30px",
                      width: "30px",
                    }}
                  />
                  <SettingsIcon
                    sx={{
                      ml: 2,
                      height: "35px",
                      width: "30px",
                    }}
                  />
                </HoverIconButton1>

                <StyledMenu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                      mx: "10px",
                    }}
                  >
                    <Typography
                      sx={{
                        display: "flex",
                      }}
                    ></Typography>

                    <StyledMenuItem
                      isSelected={selectedItem === "profile"}
                      onClick={handleProfile}
                    >
                      <Profile />
                      <Typography sx={{ marginLeft: "10px" }}>
                        {" "}
                        Profile{" "}
                      </Typography>
                    </StyledMenuItem>

                    {/* <StyledMenuItem
                      isSelected={selectedItem === "account"}
                      onClick={() => handleMenuItemClick("account")}
                    >
                      <AccountSetting />
                      <Typography sx={{ marginLeft: "10px" }}>
                        Account Setting
                      </Typography>
                    </StyledMenuItem> */}
                    <StyledMenuItem
                      isSelected={selectedItem === "logout"}
                      onClick={() => handleLogout()}
                    >
                      <LogoutIcon />
                      <Typography sx={{ marginLeft: "10px" }}>
                        Logout
                      </Typography>
                    </StyledMenuItem>
                  </Box>
                </StyledMenu>
              </Box>
            </>
          ) : (
            <>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexGrow: 1,
                  gap: "16px",
                }}
              >
                <HoverIconButton
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  onClick={handleLeftDrawerToggle}
                >
                  <MenuIcon />
                </HoverIconButton>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                }}
              >
                <Box>
                  <HoverIconButton1
                    size="large"
                    aria-label="settings"
                    color="inherit"
                    onClick={handleMenuClick}
                    sx={{
                      padding: "6px",
                    }}
                  >
                    <Avatar
                      sx={{
                        height: "30px",
                        width: "30px",
                      }}
                    />
                    <SettingsIcon
                      sx={{
                        ml: 2,
                        height: "35px",
                        width: "30px",
                      }}
                    />
                  </HoverIconButton1>
                  <StyledMenu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    sx={{
                      "& .MuiMenu-paper": {
                        width: isSmallScreen ? 200 : 350,
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                        mx: "10px",
                      }}
                    >
                      <Typography
                        sx={{
                          display: "flex",
                        }}
                      ></Typography>

                      <StyledMenuItem
                        isSelected={selectedItem === "profile"}
                        onClick={handleProfile}
                      >
                        <Profile />
                        <Typography sx={{ marginLeft: "10px" }}>
                          {" "}
                          Profile
                        </Typography>
                      </StyledMenuItem>
                      {/* <StyledMenuItem
                        isSelected={selectedItem === "account"}
                        onClick={() => handleMenuItemClick("account")}
                      >
                        <AccountSetting />
                        <Typography sx={{ marginLeft: "10px" }}>
                          Account Settings
                        </Typography>
                      </StyledMenuItem> */}
                      <StyledMenuItem
                        isSelected={selectedItem === "logout"}
                        onClick={() => handleLogout()}
                      >
                        <LogoutIcon />
                        <Typography sx={{ marginLeft: "10px" }}>
                          Logout
                        </Typography>
                      </StyledMenuItem>
                    </Box>
                  </StyledMenu>
                </Box>
              </Box>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
