import { Box, Divider, Paper, Skeleton } from "@mui/material";
import LoadingSkeleton from "../LoadingSkeleton";

/**
 * The loading state for `ProfileInfo`, mirroring its real layout: avatar +
 * name block on the left, three stat cards on the right, then the eight
 * detail rows and the contribution grid.
 *
 * Matching the final layout is the whole point — a bare `<CircularProgress />`
 * in an 80vh box guarantees a large jump when the content arrives. The
 * contribution grid reuses the skeleton `UserContributions` already shows, so
 * there is one definition of that shape rather than two.
 *
 * Deliberately not elaborate: with `staleTime: 5 min` this is only visible on
 * a cold load.
 */
const ProfileSkeleton = () => (
  <Box sx={{ px: 3, py: 1, mx: "auto", maxWidth: 1000 }}>
    <Box
      sx={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}
    >
      <Box
        sx={{ display: "flex", alignItems: "center", mb: 2, gap: 2 }}
      >
        <Skeleton
          variant="circular"
          sx={{
            width: { xs: 50, sm: 65, md: 80, lg: 100 },
            height: { xs: 50, sm: 65, md: 80, lg: 100 },
          }}
        />
        <Box>
          <Skeleton variant="text" width={180} sx={{ fontSize: "1.9rem" }} />
          <Skeleton variant="text" width={140} />
          <Skeleton variant="text" width={100} />
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-evenly",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} variant="rounded" width={90} height={90} />
        ))}
      </Box>
    </Box>

    <Divider sx={{ my: 2 }} />

    <Box>
      {Array.from({ length: 8 }).map((_, i) => (
        <Paper key={i} elevation={1} sx={{ my: 1, p: 1, display: "flex" }}>
          <Skeleton variant="rounded" width="100%" height={32} />
        </Paper>
      ))}
    </Box>

    <Box sx={{ mt: 2 }}>
      <LoadingSkeleton />
    </Box>
  </Box>
);

export default ProfileSkeleton;
