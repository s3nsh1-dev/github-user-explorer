import { Box, Button, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

/**
 * One page for every "that isn't a thing" state: a bad route, a username the
 * GitHub rules reject, a repository name that cannot exist. It was
 * `<div>Not Found</div>` — three unstyled words in an app with a custom dark
 * theme and an animated theme switch. report/suggestions/10 §10a.
 *
 * Parameterised rather than duplicated, so "user not found", "repository not
 * found" and "page not found" stay one component and one design.
 *
 * No search box here on purpose: the shared `<SearchBar>` is P37's, and
 * inlining a second copy of the home-page form now would fork the design
 * before that lands.
 */
type Props = {
  title?: string;
  message?: string;
};

const NotFound = ({
  title = "404",
  message = "That page doesn’t exist.",
}: Props) => (
  <Box
    sx={{
      minHeight: "70vh",
      display: "grid",
      placeItems: "center",
      alignContent: "center",
      textAlign: "center",
      gap: 2,
      p: 3,
    }}
  >
    <Typography fontFamily="monospace" fontSize={{ xs: 48, sm: 64 }}>
      {title}
    </Typography>
    <Typography color="text.secondary">{message}</Typography>
    <Button component={RouterLink} to="/" variant="contained">
      Back to search
    </Button>
  </Box>
);

export default NotFound;
