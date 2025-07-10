import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import {
  useRef,
  useState,
  useEffect,
  type FormEvent,
  type ChangeEvent,
} from "react";
import { useNavigate } from "react-router-dom";
import StaredRepositories from "../components/StaredRepositories";

const Home = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSearch = (event: FormEvent) => {
    event.preventDefault();
    const trimUserName = searchTerm.trim();
    if (searchTerm.length <= 2) {
      alert("Please enter at least 3 characters to search for a user.");
      return;
    }
    setSearchTerm("");
    navigate(`/explore?query=${trimUserName}`);
  };
  return (
    <>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "end",
          alignItems: "end",
          paddingRight: "20px",
          marginTop: "80px",
        }}
      >
        <StaredRepositories />
      </Box>
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
          sx={{ display: "flex", gap: 2 }}
          component={"form"}
          onSubmit={(event) => handleSearch(event)}
          noValidate
        >
          <TextField
            inputRef={inputRef}
            value={searchTerm}
            id="outlined-basic"
            variant="outlined"
            placeholder="Enter the GitHub username..."
            sx={{
              width: { xs: "55vw", sm: "300px" },
            }}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              setSearchTerm(event.target.value)
            }
          />
          <Button variant="contained" type="submit">
            Search
          </Button>
        </Box>
        <Typography fontSize={25} fontWeight={300} color="textSecondary">
          Search for GitHub user to view their profile and repositories
        </Typography>
      </Box>
    </>
  );
};

export default Home;
