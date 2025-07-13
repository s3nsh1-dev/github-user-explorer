import { Box, Typography, Stack, Paper, Button } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import type { Repo } from "../constants/common.types";
import { useNavigate } from "react-router-dom";
import ShowColorChangingUserName from "./ShowColorChangingUserName";

type UserProfileReposProps = {
  repos: Repo[];
  totalRepos: number;
  username: string;
};

const UserProfileRepos: React.FC<UserProfileReposProps> = ({
  repos,
  totalRepos,
  username,
}) => {
  const navigate = useNavigate();
  const handleOpenRepository = (repo: Repo) => {
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
      <Typography fontFamily="monospace" marginY={2}>
        <ShowColorChangingUserName username={username} />
        <p>
          <b>{totalRepos}</b> <i>repositories</i>
        </p>
      </Typography>
      <Stack spacing={0.5}>
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
              <Box display="flex" alignItems="center" gap={0.5} sx={{ ml: 2 }}>
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
