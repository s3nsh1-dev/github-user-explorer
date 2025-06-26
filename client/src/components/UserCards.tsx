import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { type FC } from "react";

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
    >
      <Box>
        <Box
          component={"img"}
          src={imageURL}
          alt="User-Profile-Picture"
          sx={{ height: "100px", width: "100px", borderRadius: "50%" }}
        />
        <Typography textAlign={"center"} fontWeight={"bold"}>
          {userName}
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 1,
          justifyContent: "end",
          alignItems: "end",
          padding: "10px 0px",
        }}
      >
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
        <Button
          variant="contained"
          href={githubURL}
          target="_blank"
          rel="noopener noreferrer"
        >
          View on Github
        </Button>
      </Box>
    </Paper>
  );
};

export default UserCards;
