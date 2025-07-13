import Typography from "@mui/material/Typography";
import type { GitHubUser } from "../constants/common.types";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";

type UserProfileStatsProps = {
  userProfile: GitHubUser;
};

const UserProfileStats: React.FC<UserProfileStatsProps> = ({ userProfile }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/user/${userProfile.username}?tab=repositories`);
  };
  return (
    <>
      {/* Stats */}
      <Box display="flex" justifyContent="space-between" gap={2}>
        <Button
          variant="outlined"
          onClick={handleClick}
          sx={{ display: "flex", flexDirection: "column" }}
        >
          <Typography fontWeight={600}>{userProfile.public_repos}</Typography>
          <Typography variant="body2" color="text.secondary">
            Public Repos
          </Typography>
        </Button>

        <Button
          variant="contained"
          sx={{ display: "flex", flexDirection: "column" }}
          disabled
        >
          <Typography fontWeight={600}>{userProfile.followers}</Typography>
          <Typography variant="body2" color="text.secondary">
            Followers
          </Typography>
        </Button>

        <Button
          variant="contained"
          sx={{ display: "flex", flexDirection: "column" }}
          disabled
        >
          <Typography fontWeight={600}>{userProfile.following}</Typography>
          <Typography variant="body2" color="text.secondary">
            Following
          </Typography>
        </Button>
      </Box>
    </>
  );
};

export default UserProfileStats;
