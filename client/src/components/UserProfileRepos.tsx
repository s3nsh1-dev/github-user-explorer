import { Box, Typography, Stack, Paper } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import type { Repo } from "../constants/common.types";

type UserProfileReposProps = {
  repos: Repo[];
};

const UserProfileRepos: React.FC<UserProfileReposProps> = ({ repos }) => {
  return (
    <>
      {/* Repositories List */}
      <Typography variant="h6" fontWeight={600} gutterBottom>
        Repositories
      </Typography>
      <Stack spacing={2}>
        {repos.length === 0 ? (
          <Typography variant="body2">No repositories found.</Typography>
        ) : (
          repos.map((repo) => (
            <Paper
              key={repo.id}
              elevation={1}
              sx={{ p: 2, display: "flex", justifyContent: "space-between" }}
            >
              <Box>
                <Typography fontWeight={600}>{repo.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {repo.description || "No description"}
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={0.5}>
                <StarIcon fontSize="small" color="action" />
                <Typography variant="body2">{repo.stargazers_count}</Typography>
              </Box>
            </Paper>
          ))
        )}
      </Stack>
    </>
  );
};

export default UserProfileRepos;
