import Typography from "@mui/material/Typography";
import type { GitHubUser } from "../constants/common.types";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { Link as RouterLink } from "react-router-dom";
import { repoPageLink } from "../helper/paginate";

type UserProfileStatsProps = {
  userProfile: GitHubUser;
};

const style1 = {
  display: "flex",
  justifyContent: "space-evenly",
  flexWrap: "wrap",
  gap: 2,
};

/**
 * The three cards were all `Button`s so they would look alike — two of them
 * `disabled`, purely for the styling. That made follower counts announce as
 * "unavailable", removed them from the reading order for no reason, greyed
 * the very number the visitor came to read, and promised a click that never
 * arrives. report/suggestions/09 §9c.
 *
 * Now the shape is shared and the *affordance* is not: the one card that
 * navigates looks and behaves like a control; the two that are data are a
 * `Paper` with full-contrast text.
 */
const cardShape = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  width: "90px",
  height: "90px",
  borderRadius: 1,
};

const StatCard = ({ value, label }: { value: number; label: string }) => (
  <Paper elevation={1} sx={cardShape}>
    <Typography fontWeight={600}>{value}</Typography>
    <Typography
      variant="body2"
      color="text.secondary"
      sx={{ textTransform: "uppercase", fontSize: "0.8125rem" }}
    >
      {label}
    </Typography>
  </Paper>
);

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
        sx={cardShape}
      >
        <Typography fontWeight={600}>{userProfile.public_repos}</Typography>
        <Typography variant="body2" color="text.secondary">
          Public Repos
        </Typography>
      </Button>

      <StatCard value={userProfile.followers} label="Followers" />
      <StatCard value={userProfile.following} label="Following" />
    </Box>
  );
};

export default UserProfileStats;
