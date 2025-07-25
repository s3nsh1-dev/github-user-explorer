import { Avatar, Box, Typography, IconButton } from "@mui/material";
import type { GitHubUser } from "../constants/common.types";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarIcon from "@mui/icons-material/Star";
import useStartedUserList from "../hooks/useStaredUserList";

type UserProfileProps = {
  userProfile: GitHubUser;
};

const style1 = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  mb: 2,
  gap: 2,
};
const style2 = {
  width: { xs: 50, sm: 65, md: 80, lg: 100 },
  height: { xs: 50, sm: 65, md: 80, lg: 100 },
};
const style3 = {
  display: "flex",
  alignItems: "center",
};
const style4 = {
  fontWeight: 600,
  fontSize: {
    xs: "1.2rem",
    sm: "1.5rem",
    md: "1.7rem",
    lg: "1.9rem",
  },
};

const UserProfileHeader: React.FC<UserProfileProps> = ({ userProfile }) => {
  const staredContext = useStartedUserList();

  return (
    <Box sx={style1}>
      <Avatar
        src={userProfile.avatar_url}
        alt={userProfile.username}
        sx={style2}
      />
      <Box>
        <Box sx={style3}>
          <Typography sx={style4}>{userProfile.username}</Typography>
          <IconButton
            onClick={() =>
              staredContext?.updateStaredList(userProfile.username)
            }
          >
            {staredContext?.checkStared(userProfile.username) ? (
              <StarIcon color="warning" />
            ) : (
              <StarBorderIcon />
            )}
          </IconButton>
        </Box>
        <Typography variant="subtitle1">{userProfile.name}</Typography>
        <Typography variant="body2" color="text.secondary">
          📍 {userProfile.location || "Unknown"}
        </Typography>
      </Box>
    </Box>
  );
};

export default UserProfileHeader;
