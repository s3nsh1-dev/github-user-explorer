import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import type { GitHubApiUser, GitHubUser } from "../constants/common.types";
import { mapGitHubResponse } from "../helper/simplifyGitHubResponse";
import { Avatar, Box, Typography, Divider, Stack, Paper } from "@mui/material";
import Grid from "@mui/material/Grid";
import StarIcon from "@mui/icons-material/Star";

const ProfileInfo = () => {
  const { username } = useParams();
  const {
    data: userData,
    isLoading: userLoading,
    error: userError,
  } = useQuery({
    queryKey: ["userProfile", username],
    queryFn: async () => {
      if (!username) throw new Error("Username is required");
      const response = await fetch(`https://api.github.com/users/${username}`);
      if (!response.ok) throw new Error("Failed to fetch user profile");
      return await response.json();
    },
    enabled: !!username,
  });

  const {
    data: reposData,
    isLoading: reposLoading,
    error: reposError,
  } = useQuery({
    queryKey: ["userRepos", username],
    queryFn: async () => {
      if (!username) throw new Error("Username is required");
      const response = await fetch(
        `https://api.github.com/users/${username}/repos`
      );
      if (!response.ok) throw new Error("Failed to fetch user repositories");
      return await response.json();
    },
    enabled: !!username,
  });

  if (userLoading || reposLoading) return <div>Loading...</div>;
  if (userError) return <div>Error: {userError.message}</div>;
  if (reposError) return <div>Error: {reposError.message}</div>;

  const userProfile: GitHubUser = mapGitHubResponse(userData as GitHubApiUser);
  const repos = Array.isArray(reposData) ? reposData : [];

  return (
    <Box mx="auto" mt={4} px={3}>
      {/* Profile Header */}
      <Stack direction="row" spacing={2} alignItems="center">
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

      {/* Stats */}
      <Grid container spacing={2} my={3}>
        <Grid>
          <Paper elevation={1} sx={{ textAlign: "center", p: 2 }}>
            <Typography fontWeight={600}>{userProfile.public_repos}</Typography>
            <Typography variant="body2" color="text.secondary">
              Public Repos
            </Typography>
          </Paper>
        </Grid>
        <Grid>
          <Paper elevation={1} sx={{ textAlign: "center", p: 2 }}>
            <Typography fontWeight={600}>{userProfile.followers}</Typography>
            <Typography variant="body2" color="text.secondary">
              Followers
            </Typography>
          </Paper>
        </Grid>
        <Grid>
          <Paper elevation={1} sx={{ textAlign: "center", p: 2 }}>
            <Typography fontWeight={600}>{userProfile.following}</Typography>
            <Typography variant="body2" color="text.secondary">
              Following
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

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
    </Box>
  );
};

export default ProfileInfo;
