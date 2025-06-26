import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { type FC } from "react";
import useMode from "../hooks/useMode";

interface UserCardsProps {
  userName: string;
  imageURL: string;
  githubURL: string;
  seeRepos: string;
}

const UserCards: FC<UserCardsProps> = ({
  userName,
  imageURL,
  githubURL,
  seeRepos,
}) => {
  const { mode } = useMode();
  const navigate = useNavigate();
  const handleUserProfileVisit = () => {
    navigate(`/user/${userName}`, {
      state: { userName, imageURL, githubURL },
    });
  };
  return (
    <Paper
      sx={{
        display: "flex",
        gap: 2,
        margin: 2,
        padding: 2,
      }}
      elevation={5}
    >
      <Box>
        <Box
          component={"img"}
          src={imageURL}
          alt="User-Profile-Picture"
          sx={{
            height: "100px",
            width: "100px",
            borderRadius: "50%",
            border: `2px solid ${mode === "light" ? "black" : "white"}`,
          }}
        />
        <Typography textAlign={"center"} fontWeight={"bold"}>
          {userName}
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Button
          variant="outlined"
          component={"a"}
          href={githubURL}
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            marginTop: "35px",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          View this profile on a GitHub.
        </Button>
        <Box sx={{ display: "flex", gap: 3 }}>
          <Button variant="contained" onClick={handleUserProfileVisit}>
            Open Profile
          </Button>
          <Button
            variant="contained"
            href={seeRepos}
            target="_blank"
            rel="noopener noreferrer"
          >
            Repositories
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default UserCards;
