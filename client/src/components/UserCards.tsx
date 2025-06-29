import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { type FC } from "react";
import useMode from "../hooks/useMode";
import { Link } from "react-router-dom";
import type { UserCardsProps } from "../constants/common.types";

const UserCards: FC<UserCardsProps> = ({
  userName,
  imageURL,
  githubURL,
  seeRepos,
}) => {
  const { mode } = useMode();
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
          <Link to={`/user/${userName}?page=1`}>
            <Button variant="contained">Open Profile</Button>
          </Link>
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
