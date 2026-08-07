import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useState, type FormEvent, type ChangeEvent } from "react";
import { useNavigate, createSearchParams } from "react-router-dom";

/**
 * The shortest string worth sending to GitHub's search endpoint. It is a
 * product rule, not a GitHub one — a one-character query matches most of the
 * site and is never what the visitor meant.
 */
const MIN_SEARCH_LENGTH = 3;

const LowerHomeUI = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSearch = (event: FormEvent) => {
    event.preventDefault();
    // The guard used to test `searchTerm.length` and then navigate with the
    // trimmed value, so "  a  " passed at length 5 and searched for "a" — the
    // single-character search the guard exists to prevent. Validate what is
    // actually sent.
    const trimmed = searchTerm.trim();
    if (trimmed.length < MIN_SEARCH_LENGTH) {
      setError(`Enter at least ${MIN_SEARCH_LENGTH} characters.`);
      return;
    }
    setError(null);
    setSearchTerm("");
    // createSearchParams encodes; do not pre-encode, or "C++" becomes "%252B".
    navigate({
      pathname: "/explore",
      search: `?${createSearchParams({ query: trimmed })}`,
    });
  };
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        margin: "10px",
        gap: 2,
        height: "60vh",
      }}
    >
      <Typography fontSize={42} fontWeight={500}>
        Github User Explorer
      </Typography>
      <Box
        sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}
        component={"form"}
        onSubmit={(event) => handleSearch(event)}
        noValidate
      >
        <TextField
          value={searchTerm}
          id="github-username-search"
          label="GitHub username"
          variant="outlined"
          autoFocus
          error={Boolean(error)}
          // A non-breaking space keeps the helper row in the layout when there
          // is no error, so showing one does not shove the page down.
          helperText={error ?? " "}
          sx={{
            width: { xs: "55vw", sm: "300px" },
          }}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            setSearchTerm(event.target.value);
            setError(null);
          }}
        />
        <Button variant="contained" type="submit" sx={{ height: 56 }}>
          Search
        </Button>
      </Box>
      <Typography fontSize={25} fontWeight={300} color="textSecondary">
        Search for GitHub user to view their profile and repositories
      </Typography>
    </Box>
  );
};

export default LowerHomeUI;
