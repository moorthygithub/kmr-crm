import { Typography, Card } from "@mui/material";
import { grey } from "@mui/material/colors";
function Maintance() {
  return (
    <>
      <Card
        sx={{
          display: "flex",
          justifyContent: "center",
          textAlign: "center",
          height: "100vh",
          padding: "20px",
          bgcolor: grey[200],
          flexDirection: "column",
        }}
      >
        <Typography variant="h3">Maintance</Typography>
        <Typography variant="h6"> In maintaance Mode Please check agian Later</Typography>
      </Card>
    </>
  );
}

export default Maintance;
