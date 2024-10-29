import React from "react";
import CountUp from "react-countup";
import { Card, CardContent, Typography, Grid } from "@mui/material";
import { blue, green, grey, red, yellow } from "@mui/material/colors";

function Mame() {
  const totalTrialUserCount = localStorage.getItem("totalTrialUser_count") || 0;
  const totalInactiveUserCount =
    localStorage.getItem("totalInactiveUser_count") || 0;
  const totalUserCount = localStorage.getItem("totalUser_count") || 0;
  const renewalCount = localStorage.getItem("renewal_count") || 0;

  return (
    <Grid container spacing={2} sx={{ marginTop: "20px" }}>
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ bgcolor: green[100], borderRadius: "10px" }}>
          <CardContent>
            <Typography
              variant="h6"
              sx={{
                display: "flex",
                justifyContent: "center",
                fontSize: "1.3rem",
                fontWeight: "600",
              }}
            >
              Total Trial Users
            </Typography>
            <Typography variant="h4">
              <CountUp
                style={{
                  display: "flex",
                  justifyContent: "center",
                  fontWeight: 600,
                  fontSize: "2.5rem",
                  color: green[500],
                }}
                start={0}
                end={totalTrialUserCount}
                duration={3}
                useEasing={true}
              />
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ bgcolor: blue[100], borderRadius: "10px" }}>
          <CardContent>
            <Typography
              variant="h6"
              sx={{
                display: "flex",
                justifyContent: "center",
                fontSize: "1.3rem",
                fontWeight: "600",
              }}
            >
              Total Users
            </Typography>
            <Typography variant="h4">
              <CountUp
                style={{
                  display: "flex",
                  justifyContent: "center",
                  fontWeight: 600,
                  fontSize: "2.5rem",
                  color: blue[500],
                }}
                start={0}
                end={totalUserCount}
                duration={3}
                useEasing={true}
              />
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ bgcolor: yellow[100], borderRadius: "10px" }}>
          <CardContent>
            <Typography
              variant="h6"
              sx={{
                display: "flex",
                justifyContent: "center",
                fontSize: "1.3rem",
                fontWeight: "600",
              }}
            >
              Renewal Count
            </Typography>
            <Typography variant="h4">
              <CountUp
                style={{
                  display: "flex",
                  justifyContent: "center",
                  fontWeight: 600,
                  fontSize: "2.5rem",
                  color: grey[500],
                }}
                start={0}
                end={renewalCount}
                duration={3}
                useEasing={true}
              />
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ bgcolor: red[100], borderRadius: "10px" }}>
          <CardContent>
            <Typography
              variant="h6"
              sx={{
                display: "flex",
                justifyContent: "center",
                fontSize: "1.3rem",
                fontWeight: "600",
              }}
            >
              Inactive Users
            </Typography>
            <Typography variant="h4">
              <CountUp
                style={{
                  display: "flex",
                  justifyContent: "center",
                  fontWeight: 600,
                  fontSize: "2.5rem",
                  color: red[500],
                }}
                start={0}
                end={totalInactiveUserCount}
                duration={3}
                useEasing={true}
              />
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

export default Mame;
