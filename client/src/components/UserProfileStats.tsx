import { Paper, Typography } from "@mui/material";
import type { GitHubUser } from "../constants/common.types";
import Grid from "@mui/material/Grid";

type UserProfileStatsProps = {
  userProfile: GitHubUser;
};

const UserProfileStats: React.FC<UserProfileStatsProps> = ({ userProfile }) => {
  return (
    <>
      {/* Stats */}
      <Grid container spacing={2} my={3}>
        <Grid>
          <Paper elevation={1} sx={{ textAlign: "center", p: 1 }}>
            <Typography fontWeight={600}>{userProfile.public_repos}</Typography>
            <Typography variant="body2" color="text.secondary">
              Public Repos
            </Typography>
          </Paper>
        </Grid>
        <Grid>
          <Paper elevation={1} sx={{ textAlign: "center", p: 1 }}>
            <Typography fontWeight={600}>{userProfile.followers}</Typography>
            <Typography variant="body2" color="text.secondary">
              Followers
            </Typography>
          </Paper>
        </Grid>
        <Grid>
          <Paper elevation={1} sx={{ textAlign: "center", p: 1 }}>
            <Typography fontWeight={600}>{userProfile.following}</Typography>
            <Typography variant="body2" color="text.secondary">
              Following
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default UserProfileStats;
