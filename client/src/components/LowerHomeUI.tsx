import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import SearchBar from "./SearchBar";

const LowerHomeUI = () => {
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
      {/* The form itself lives in SearchBar, which the navbar, the /explore
          empty states and the 404 page render too — one validation rule, not
          four copies of it. */}
      <SearchBar variant="hero" focusOnMount />
      <Typography fontSize={25} fontWeight={300} color="textSecondary">
        Search for GitHub user to view their profile and repositories
      </Typography>
    </Box>
  );
};

export default LowerHomeUI;
