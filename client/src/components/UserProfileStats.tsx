import Typography from "@mui/material/Typography";
import type { GitHubUser } from "../constants/common.types";
import Box from "@mui/material/Box";
import { Link as RouterLink } from "react-router-dom";
import { repoPageLink } from "../helper/paginate";
import Button from "@mui/material/Button";

type UserProfileStatsProps = {
  userProfile: GitHubUser;
};

const style1 = {
  display: "flex",
  justifyContent: "space-evenly",
  flexWrap: "wrap",
  gap: 2,
};
const style2 = {
  display: "flex",
  flexDirection: "column",
  width: "90px",
  height: "90px",
};

const UserProfileStats: React.FC<UserProfileStatsProps> = ({ userProfile }) => {
  return (
    <Box sx={style1}>
      {/* A real link, not a button that navigates: ⌘-click opens the
          repository list in a new tab, which is the whole point of a card
          people click while comparing profiles. */}
      <Button
        variant="outlined"
        component={RouterLink}
        to={repoPageLink(userProfile.username, 1)}
        sx={style2}
      >
        <Typography fontWeight={600}>{userProfile.public_repos}</Typography>
        <Typography variant="body2" color="text.secondary">
          Public Repos
        </Typography>
      </Button>

      <Button variant="contained" sx={style2} disabled>
        <Typography fontWeight={600}>{userProfile.followers}</Typography>
        <Typography variant="body2" color="text.secondary">
          Followers
        </Typography>
      </Button>

      <Button variant="contained" sx={style2} disabled>
        <Typography fontWeight={600}>{userProfile.following}</Typography>
        <Typography variant="body2" color="text.secondary">
          Following
        </Typography>
      </Button>
    </Box>
  );
};

export default UserProfileStats;
