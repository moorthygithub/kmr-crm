import PasswordDetails from "./PasswordDetails";
import ProfileDetails from "./ProfileDetails";
import { Box } from "@mui/material";
import ProfileTitle from "./ProfileTitle";
import PageTitle from "../common/ProfileTitle";
function Profile() {
  return (
    <Box sx={{ marginTop: "100px" }}>
      <PageTitle
        title=" Profile"
        backLink="/dashbord"
      
      />{" "}
      <ProfileTitle />
      <ProfileDetails />
      <PasswordDetails />
    </Box>
  );
}
export default Profile;
