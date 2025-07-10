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
        margin: 1,
        padding: 1,
      }}
      elevation={5}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          margin: 1,
        }}
      >
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
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          gap: 2,
          padding: 1,
        }}
      >
        <Typography
          textAlign={"center"}
          fontSize="1 rem"
          sx={{
            fontFamily: "monospace",
            color: "grey",
          }}
        >
          &gt;&gt;&gt;{" "}
          <span
            style={{
              fontWeight: "bold",
              color: mode === "light" ? "#16610E" : "#FFD63A",
            }}
          >
            {userName}
          </span>{" "}
          &lt;&lt;&lt;
        </Typography>
        <Button
          variant="outlined"
          component={"a"}
          href={githubURL}
          target="_blank"
          rel="noopener noreferrer"
          sx={{
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
