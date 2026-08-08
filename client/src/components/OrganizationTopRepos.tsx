import type { FC } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Button,
} from "@mui/material";
import useFetchOrganizationRepos from "../hooks/useFetchOrganizationRepos";
import ErrorState from "./ErrorState";

const OrganizationTopRepos: FC<{ username: string }> = ({ username }) => {
  const { data, isLoading, error, refetch } =
    useFetchOrganizationRepos(username);

  if (isLoading)
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );

  if (error) return <ErrorState error={error} onRetry={refetch} sx={{ mt: 4 }} />;

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
                  // Both segments are encoded for the same reason P07 encodes
                  // the API URLs: a login or repository name carrying a `/`
                  // or a `..` would otherwise escape its segment and point the
                  // link somewhere else on github.com. A rendered link is a
                  // smaller problem than an authenticated request, which is
                  // why this outlived S2 — but it is the same bug.
                  href={`https://github.com/${encodeURIComponent(
                    username
                  )}/${encodeURIComponent(repo.name)}`}
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
