import { Box, Typography } from "@mui/material";
import SearchBar from "../components/SearchBar";

/**
 * One page for every "that isn't a thing" state: a bad route, a username the
 * GitHub rules reject, a repository name that cannot exist. It was
 * `<div>Not Found</div>` — three unstyled words in an app with a custom dark
 * theme and an animated theme switch. report/suggestions/10 §10a.
 *
 * Parameterised rather than duplicated, so "user not found", "repository not
 * found" and "page not found" stay one component and one design.
 *
 * The "Back to search" button that used to sit here only moved the visitor to
 * the home page to start again; P37's shared `<SearchBar>` lets them search
 * from the dead end itself, which is the whole reason the button was left as
 * a placeholder rather than designed.
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
    <SearchBar variant="hero" />
  </Box>
);

export default NotFound;
