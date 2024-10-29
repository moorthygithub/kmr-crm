import React from "react";
import { Link } from "react-router-dom";
import { IconButton, Typography, Box, Button } from "@mui/material";
import ArrowBack from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

const HeaderWithButton = ({ title, backLink, buttonLabel, buttonLink }) => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    if (backLink == "-1") {
      navigate(-1);
    } else {
      navigate(backLink);
    }
  };

  const handleButtonClick = () => {
    navigate(buttonLink);
  };

  return (
    <Box
      className="header-container"
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 2,
        cursor: "pointer",
      }}
    >
      <Box display="flex" alignItems="center" onClick={handleBackClick}>
        <IconButton aria-label="Back">
          <ArrowBack />
        </IconButton>
        <Typography
          variant="h6"
          sx={{
            ml: 1,
            fontSize: {
              xs: "15px",
              sm: "20px",
            },
          }}
        >
          {title}
        </Typography>
      </Box>

      {buttonLabel && buttonLink !== "none" && (
        <Box>
          <Button
            variant="outlined"
            color="primary"
            sx={{
              fontSize: {
                xs: "10px",
                sm: "15px",
              },
            }}
            onClick={handleButtonClick}
          >
            {buttonLabel}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default HeaderWithButton;
