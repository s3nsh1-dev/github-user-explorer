import { Box, Button, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

/**
 * The fallback an `AppErrorBoundary` renders when a render crashed.
 *
 * It deliberately says nothing about *what* crashed. What a render error says
 * is an internal implementation string — see report/vulnerabilities/09 — and the
 * boundary already logs the real one to the console in development, which is
 * where it is useful.
 */
const SomethingWentWrong = ({ onRetry }: { onRetry?: () => void }) => (
  <Box
    sx={{
      minHeight: "70vh",
      display: "grid",
      placeItems: "center",
      textAlign: "center",
      gap: 2,
      p: 3,
    }}
  >
    <Typography fontFamily="monospace" fontSize={{ xs: 36, sm: 48 }}>
      Something went wrong
    </Typography>
    <Typography color="text.secondary">
      This page hit an unexpected error. Trying again usually fixes it.
    </Typography>
    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", justifyContent: "center" }}>
      {onRetry && (
        <Button variant="contained" onClick={onRetry}>
          Try again
        </Button>
      )}
      <Button component={RouterLink} to="/" variant="outlined">
        Back to home
      </Button>
    </Box>
  </Box>
);

export default SomethingWentWrong;
