import { Avatar, Box, Typography, Stack } from "@mui/material";
import type { GitHubUser } from "../constants/common.types";

type UserProfileProps = {
  userProfile: GitHubUser;
};

const UserProfileHeader: React.FC<UserProfileProps> = ({ userProfile }) => {
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
          <Typography variant="h5" fontWeight={600}>
            {userProfile.username}
          </Typography>
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
