import { Box, Typography, Stack, Paper, Button } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import type { Repo } from "../constants/common.types";
import { useNavigate } from "react-router-dom";

type UserProfileReposProps = {
  repos: Repo[];
};

const UserProfileRepos: React.FC<UserProfileReposProps> = ({ repos }) => {
  const navigate = useNavigate();
  const handleOpenRepository = (repo: Repo) => {
    const username = repo.full_name.split("/")[0];
    const repoName = repo.name;
    console.log("navigate:", repoName, username);
    navigate(`/user/${repo.full_name}`, {
      state: { repoName, username },
    });
  };

  console.log("have repos", repos);

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
              <Box display="flex" alignItems="center" gap={0.5} sx={{ ml: 1 }}>
                <StarIcon fontSize="small" color="action" />
                <Typography variant="body2">{repo.stargazers_count}</Typography>
                <Button
                  variant="contained"
                  sx={{ ml: 1 }}
                  onClick={() => handleOpenRepository(repo)}
                >
                  View
                </Button>
              </Box>
            </Paper>
          ))
        )}
      </Stack>
    </>
  );
};

export default UserProfileRepos;
