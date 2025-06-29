import {
  Box,
  Typography,
  Chip,
  Divider,
  Button,
  Tooltip,
  IconButton,
  Stack,
  useTheme,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import Skeleton from "@mui/material/Skeleton";
import { useParams, useNavigate } from "react-router-dom";
import useShowIndividualRepo from "../hooks/useShowIndividualRepo";
import type { GitHubRepo } from "../constants/common.types";

const ShowSelectedRepo = () => {
  const { repoName, username } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();

  const {
    data: repo,
    isLoading,
    error,
  } = useShowIndividualRepo({
    repoName: repoName || "demoRepo",
    username: username || "demoUserName",
  });

  if (isLoading) {
    return (
      <Box p={3}>
        <Skeleton variant="text" width="60%" />
        <Skeleton variant="rectangular" height={200} />
      </Box>
    );
  }
  if (error) return <div>Error: {error.message}</div>;
  if (!repo) return <div>No Data Found</div>;

  const {
    name,
    description,
    language,
    stargazers_count,
    forks_count,
    html_url,
    created_at,
    updated_at,
    open_issues_count,
    size,
    visibility,
    license,
    default_branch,
  }: GitHubRepo = repo;

  const formatSize = (kb: number): string =>
    kb > 1024 ? `${(kb / 1024).toFixed(2)} MB` : `${kb} KB`;

  return (
    <Box
      maxWidth={800}
      mx="auto"
      mt={4}
      p={3}
      borderRadius={3}
      boxShadow={5}
      bgcolor={theme.palette.mode === "dark" ? "#2c2f36" : "#f4f4f4"}
      color={theme.palette.mode === "dark" ? "#fff" : "#000"}
    >
      <Box display="flex" alignItems="center" mb={2}>
        <IconButton onClick={() => navigate(-1)} sx={{ mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" fontWeight={700}>
          {name}
        </Typography>
      </Box>

      {description && (
        <Typography variant="body1" mb={2} fontStyle="italic">
          {description}
        </Typography>
      )}

      <Divider sx={{ my: 2 }}>
        <Typography variant="subtitle1" fontWeight={600}>
          Repository Info
        </Typography>
      </Divider>
      <Stack direction="row" spacing={1} flexWrap="wrap" mb={1}>
        <Tooltip title="Primary language">
          <Chip
            label={`Language: ${language || "Unknown"}`}
            color="primary"
            variant="outlined"
          />
        </Tooltip>
        <Tooltip title="Stars received">
          <Chip
            icon={<StarIcon fontSize="small" />}
            label={`${stargazers_count}`}
            color="secondary"
            variant="outlined"
          />
        </Tooltip>
        <Tooltip title="Repository visibility">
          <Chip label={visibility} color="info" variant="outlined" />
        </Tooltip>
        <Tooltip title="Repository size">
          <Chip label={formatSize(size)} variant="outlined" />
        </Tooltip>
        <Tooltip title="Default branch">
          <Chip
            label={`Branch: ${default_branch}`}
            variant="outlined"
            color="secondary"
          />
        </Tooltip>
        {license && (
          <Tooltip title="License">
            <Chip label={license.name} color="success" variant="outlined" />
          </Tooltip>
        )}
        {/* Forks link */}
        {forks_count > 0 && (
          <Tooltip title="Forks">
            <Chip
              label={`${forks_count} Forks`}
              component="a"
              href={`${html_url}/network/members`}
              target="_blank"
              clickable
              variant="outlined"
            />
          </Tooltip>
        )}
        {/* Issues link */}
        {open_issues_count > 0 && (
          <Tooltip title="Open Issues">
            <Chip
              label={`${open_issues_count} Issues`}
              component="a"
              href={`${html_url}/issues`}
              target="_blank"
              clickable
              variant="outlined"
            />
          </Tooltip>
        )}
      </Stack>

      <Divider sx={{ my: 2 }}>
        <Typography variant="subtitle1" fontWeight={600}>
          Timeline
        </Typography>
      </Divider>
      <Typography variant="body2" color="text.secondary">
        <strong>Created:</strong> {new Date(created_at).toLocaleDateString()}{" "}
        <br />
        <strong>Last Updated:</strong>{" "}
        {new Date(updated_at).toLocaleDateString()}
      </Typography>

      <Button
        variant="contained"
        color="primary"
        href={html_url}
        target="_blank"
        endIcon={<OpenInNewIcon />}
        sx={{ mt: 2 }}
      >
        Visit on GitHub
      </Button>
    </Box>
  );
};

export default ShowSelectedRepo;
