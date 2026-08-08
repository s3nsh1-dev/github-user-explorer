import { Typography, Stack, Paper, Button, Grid, Box } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import type { Repo } from "../constants/common.types";
import { useNavigate } from "react-router-dom";
import EmptyState from "./EmptyState";
import FolderOffIcon from "@mui/icons-material/FolderOff";

const style1 = {
  padding: 1,
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
};
const style2 = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "start",
};
const style3 = {
  display: "-webkit-box",
  WebkitLineClamp: { xs: 2, sm: 3 }, // 📱 2 lines on mobile, 3 on desktop
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
  textOverflow: "ellipsis",
};
const style4 = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "end",
  alignItems: "center",
};
const style5 = {
  display: "flex",
  flexDirection: "row",
  alignContent: "center",
};

type UserProfileReposProps = {
  repos: Repo[];
};
const UserProfileRepos: React.FC<UserProfileReposProps> = ({ repos }) => {
  const navigate = useNavigate();
  const handleOpenRepository = (repo: Repo) => {
    // `full_name` is "owner/name". Passing it whole relied on the raw "/"
    // surviving into the URL and the router happening to split it into the two
    // route segments. Split it here and encode each segment instead, so the
    // route shape is explicit and neither part can escape its segment.
    const [owner, ...rest] = repo.full_name.split("/");
    const name = rest.join("/") || repo.name;
    navigate(`/user/${encodeURIComponent(owner)}/${encodeURIComponent(name)}`);
  };

  return (
    <>
      {/* Repositories List */}
      <Stack spacing={0.5}>
        {repos.length === 0 ? (
          <EmptyState
            icon={<FolderOffIcon fontSize="large" />}
            title="No public repositories"
            message="This account hasn’t published anything yet."
          />
        ) : (
          repos.map((repo) => (
            <Grid
              component={Paper}
              key={repo.id}
              container
              size={12}
              sx={style1}
              elevation={2}
            >
              <Grid size={{ xs: 7.3, sm: 9.5 }} sx={style2}>
                <Typography fontWeight={600}>{repo.name}</Typography>
                <Typography variant="body2" color="text.secondary" sx={style3}>
                  {repo.description || "No description"}
                </Typography>
              </Grid>
              <Grid size={2} gap={0.5} sx={style4}>
                <Box sx={style5}>
                  <StarIcon fontSize="small" color="action" />
                  <Typography variant="body2">
                    {repo.stargazers_count}
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  sx={{ ml: 1 }}
                  onClick={() => handleOpenRepository(repo)}
                >
                  View
                </Button>
              </Grid>
            </Grid>
          ))
        )}
      </Stack>
    </>
  );
};

export default UserProfileRepos;
