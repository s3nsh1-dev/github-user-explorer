import type { FC } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Button,
} from "@mui/material";
import useFetchOrganizationRepos from "../hooks/useFetchOrganizationRepos";

const OrganizationTopRepos: FC<{ username: string }> = ({ username }) => {
  // Inferred from the hook. The old annotation declared the error as `Error`
  // unioned with `unknown` — which collapses to plain `unknown`, and that is
  // why the render below reaches for String(error) rather than error.message.
  // The error is a GitHubError now; rewriting that render is P13's job.
  const { data, isLoading, error } = useFetchOrganizationRepos(username);

  if (isLoading)
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Alert severity="error" sx={{ mt: 4 }}>
        Error loading repositories: {String(error)}
      </Alert>
    );

  const repos = data?.organization?.repositories?.nodes || [];

  if (repos.length === 0 && !isLoading)
    return (
      <Typography textAlign="center" mt={4} fontFamily="monospace">
        🚫 No repositories found for this organization
      </Typography>
    );

  return (
    <Box mt={4}>
      <Typography variant="h6" gutterBottom fontFamily="monospace">
        🏢 Top Repositories
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 2,
          flexWrap: "wrap",
          justifyContent: "space-evenly",
        }}
      >
        {repos.map((repo, index) => (
          <Card
            key={index}
            sx={{
              borderRadius: 2,
              boxShadow: 3,
              width: "400px",
              transition: "transform 0.2s",
              "&:hover": {
                transform: "scale(1.02)",
              },
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom>
                📦 {repo.name}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                gutterBottom
                sx={{
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {repo.description || "No description provided."}
              </Typography>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mt={2}
              >
                <Typography variant="body2">
                  ⭐ Stars: {repo.stargazerCount ?? 0}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  🕒 Updated:{" "}
                  {new Date(repo.updatedAt).toLocaleDateString("en-GB", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </Typography>
              </Box>
              <Box mt={2} textAlign="right">
                <Button
                  variant="outlined"
                  size="small"
                  href={`https://github.com/${username}/${repo.name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View on GitHub
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default OrganizationTopRepos;
