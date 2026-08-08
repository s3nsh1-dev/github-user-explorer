import { Box, Paper, Skeleton } from "@mui/material";
import { PER_PAGE } from "../../helper/paginate";

/**
 * The loading state for the repositories tab, mirroring `DisplayRepoList`:
 * the username line, the repository count, and one row per repository on a
 * page. Same reason as `ProfileSkeleton` — a spinner in an 80vh box jumps.
 */
const RepoListSkeleton = () => (
  <Box maxWidth={1000} minHeight="80vh" mx="auto" px={3} py={1}>
    <Box marginY={2}>
      <Skeleton variant="text" width={220} sx={{ fontSize: "2rem" }} />
      <Skeleton variant="text" width={140} />
    </Box>
    {Array.from({ length: PER_PAGE }).map((_, i) => (
      <Paper key={i} elevation={2} sx={{ p: 1, mb: 0.5 }}>
        <Skeleton variant="rounded" width="100%" height={48} />
      </Paper>
    ))}
  </Box>
);

export default RepoListSkeleton;
