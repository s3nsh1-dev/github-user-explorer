import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { createSearchParams, useNavigate } from "react-router-dom";

/**
 * The one search form in the app.
 *
 * There used to be exactly one place to search — the home page — so landing on
 * /user/torvalds was a dead end: no way to look up anyone else without going
 * back to the logo first. The form lives here instead of in `LowerHomeUI` so
 * the navbar, the /explore empty states and the 404 page can all offer the
 * same box with the same validation, rather than four copies drifting apart.
 *
 * Submit-only, deliberately. Suggestions-as-you-type would need a debounced
 * query against GitHub's tightest endpoint (10 searches/min unauthenticated,
 * 30 authenticated) — see report/vulnerabilities/07.
 */

/**
 * The shortest string worth sending to GitHub's search endpoint. A product
 * rule, not a GitHub one: a one-character query matches most of the site and
 * is never what the visitor meant.
 *
 * Note this is a *search query*, not a username, so `isValidLogin` is the
 * wrong check here — "C++" is a legitimate search and an illegal login.
 */
const MIN_SEARCH_LENGTH = 3;

type Props = {
  /** `hero` is the full-size home-page form; `compact` fits a toolbar. */
  variant?: "hero" | "compact";
  /**
   * Take focus on mount. Named for what it does rather than `autoFocus`, so
   * the one place this becomes a real DOM attribute is the one place
   * `jsx-a11y/no-autofocus` reports — see the disable below.
   */
  focusOnMount?: boolean;
  /**
   * Must be unique on the page — the navbar box and a hero box can be
   * rendered together, and two fields sharing an id break the `<label for>`
   * association for both.
   */
  id?: string;
  /** Lets the navbar collapse its mobile panel once a search is submitted. */
  onSubmitted?: () => void;
};

const SearchBar = ({
  variant = "hero",
  focusOnMount = false,
  id = "github-username-search",
  onSubmitted,
}: Props) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const compact = variant === "compact";

  const handleSearch = (event: FormEvent) => {
    event.preventDefault();
    // Validate what is actually sent. The original tested the untrimmed
    // length and navigated with the trimmed value, so "  a  " passed at
    // length 5 and searched for "a" (P20).
    const trimmed = searchTerm.trim();
    if (trimmed.length < MIN_SEARCH_LENGTH) {
      setError(`Enter at least ${MIN_SEARCH_LENGTH} characters.`);
      return;
    }
    setError(null);
    setSearchTerm("");
    // createSearchParams encodes; pre-encoding here would yield "%252B" for
    // the "+" in a query like "C++".
    navigate({
      pathname: "/explore",
      search: `?${createSearchParams({ query: trimmed })}`,
    });
    onSubmitted?.();
  };

  return (
    <Box
      component="form"
      role="search"
      onSubmit={handleSearch}
      noValidate
      sx={{
        display: "flex",
        gap: compact ? 0.5 : 2,
        alignItems: "flex-start",
        justifyContent: "center",
        width: compact ? "100%" : "auto",
      }}
    >
      <TextField
        id={id}
        value={searchTerm}
        label="GitHub username"
        variant="outlined"
        size={compact ? "small" : "medium"}
        // The rule guards against stealing focus from page content. Here the
        // field IS the content: every screen that renders it focused — home,
        // /explore with no query, the mobile panel a tap just opened — exists
        // to be typed into, and only one field is focused per page.
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus={focusOnMount}
        error={Boolean(error)}
        // A non-breaking space keeps the helper row in the layout at all
        // times, so showing an error does not shove the page (or the toolbar)
        // around.
        helperText={error ?? " "}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          setSearchTerm(event.target.value);
          setError(null);
        }}
        sx={
          compact
            ? { width: { xs: "100%", sm: 220, md: 280 } }
            : { width: { xs: "55vw", sm: "300px" } }
        }
      />
      {/* A labelled button where there is room for one, a search icon where
          there is not. Both are type="submit", so Enter in the field works
          either way. */}
      {compact ? (
        <IconButton type="submit" aria-label="Search" sx={{ mt: 0.5 }}>
          <SearchIcon />
        </IconButton>
      ) : (
        <Button variant="contained" type="submit" sx={{ height: 56 }}>
          Search
        </Button>
      )}
    </Box>
  );
};

export default SearchBar;
