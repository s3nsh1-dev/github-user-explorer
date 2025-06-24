import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";

const Home = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        margin: "auto",
        gap: 2,
        height: "90vh",
      }}
    >
      <Typography fontSize={42} fontWeight={500}>
        Github User Explorer
      </Typography>
      <Box sx={{ display: "flex", gap: 2 }}>
        <TextField
          id="outlined-basic"
          variant="outlined"
          placeholder="Enter the GitHub username..."
          sx={{ width: 300 }}
        />
        <Button variant="contained">Search</Button>
      </Box>
      <Typography fontSize={25} fontWeight={300} color="textSecondary">
        Search for GitHub user to view their profile and repositories
      </Typography>
    </Box>
  );
};

export default Home;
