import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import useMode from "../hooks/useMode";
import { useState } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const { mode, handleSettingMode } = useMode();
  const [searchTerm, setSearchTerm] = useState("");

  const handleModeChange = () => {
    const newMode = mode === "light" ? "dark" : "light";
    handleSettingMode(newMode);
  };
  const handleSearch = () => {
    console.log("Searching for user:", searchTerm, searchTerm.length);
    setSearchTerm("");
  };
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
          value={searchTerm}
          id="outlined-basic"
          variant="outlined"
          placeholder="Enter the GitHub username..."
          sx={{ width: 300 }}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
        <Box component={Link} to="/explore">
          <Button
            variant="contained"
            onClick={handleSearch}
            sx={{ height: "100%" }}
          >
            Search
          </Button>
        </Box>
        <Button variant="contained" onClick={handleModeChange}>
          Change Mode
        </Button>
      </Box>
      <Typography fontSize={25} fontWeight={300} color="textSecondary">
        Search for GitHub user to view their profile and repositories
      </Typography>
    </Box>
  );
};

export default Home;
