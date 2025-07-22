import { Avatar, Box, Typography, Stack, IconButton } from "@mui/material";
import type { GitHubUser } from "../constants/common.types";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import useStartedUserList from "../hooks/useStaredUserList";

type UserProfileProps = {
  userProfile: GitHubUser;
};

const UserProfileHeader: React.FC<UserProfileProps> = ({ userProfile }) => {
  const staredContext = useStartedUserList();
  console.log("calling check", staredContext?.checkStared("s3nsh1-dev"));

  return (
    <>
      {/* Profile Header */}
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <Avatar
          src={userProfile.avatar_url}
          alt={userProfile.username}
          sx={{ width: 100, height: 100 }}
        />
        <Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Typography variant="h5" fontWeight={600}>
              {userProfile.username}
            </Typography>
            <IconButton>
              <StarBorderIcon
              // sx={{ color: !checkStared ? "yellow" : "none" }}
              />
            </IconButton>
          </Box>
          <Typography variant="subtitle1">{userProfile.name}</Typography>
          <Typography variant="body2" color="text.secondary">
            📍 {userProfile.location || "Unknown"}
          </Typography>
        </Box>
      </Stack>
    </>
  );
};

export default UserProfileHeader;
