import { Box, Typography, Stack, Paper, Button } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import type { Repo } from "../constants/common.types";
import { useNavigate } from "react-router-dom";

type UserProfileReposProps = {
  repos: Repo[];
  username: string;
};
const UserProfileRepos: React.FC<UserProfileReposProps> = ({
  repos,
  username,
}) => {
  const navigate = useNavigate();
  const handleOpenRepository = (repo: Repo) => {
    const repoName = repo.name;
    navigate(`/user/${repo.full_name}`, {
      state: { repoName, username },
    });
  };

  return (
    <>
      {/* Repositories List */}
      <Stack spacing={0.5}>
        {repos.length === 0 ? (
          <Typography variant="body2">No repositories found.</Typography>
        ) : (
          repos.map((repo) => (
            <Paper
              key={repo.id}
              elevation={1}
              sx={{
                p: 2,
                display: "flex",
                justifyContent: "space-between",
                maxheight: { xs: 10, sm: 20 },
              }}
            >
              <Box>
                <Typography fontWeight={600}>{repo.name}</Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    display: "-webkit-box",
                    WebkitLineClamp: { xs: 2, sm: 3 }, // 📱 2 lines on mobile, 3 on desktop
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
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
