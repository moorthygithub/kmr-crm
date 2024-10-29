import { Box, Typography, Avatar } from "@mui/material";

function ProfileTitle() {
  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "10px",
        }}
      >
        <Typography sx={{ fontSize: "1.5rem", fontWeight: 700 }}>
          Member Profile
        </Typography>
      </Box>

      <Box
        sx={{
          background: "linear-gradient(to right, #c6ffdd, #fbd786, #f7797d)",
          display: "flex",
          justifyContent: "space-evenly",
          alignItems: "center",
          height: "70px",
          borderRadius: "40px",
        }}
      >
        <Box>
          <Avatar
            sx={{
              height: "5.5rem",
              width: "5.5rem",
              border: "4px solid transparent",
              background:
                "linear-gradient(to right, #f64f59, #c471ed, #12c2e9)",
              backgroundClip: "padding-box",
              borderRadius: "50%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: "0 0 0 4px white",
            }}
          />
        </Box>
        <Typography sx={{ fontSize: "20px", fontWeight: 700 }}>
          Admins
        </Typography>
        <Box></Box>
      </Box>
    </Box>
  );
}

export default ProfileTitle;
