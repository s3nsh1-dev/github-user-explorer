import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import type { FC } from "react";
import useMode from "../hooks/useMode";
import { Link } from "react-router-dom";
import type { UserCardsProps } from "../constants/common.types";

const UserCards: FC<UserCardsProps> = ({ userName, imageURL, githubURL }) => {
  const { mode } = useMode();
  return (
    <Paper
      sx={{
        display: "flex",
        marginBottom: 1,
        padding: "0px 20px",
        margin: "0px 10px 10px 10px",
      }}
      elevation={5}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          // margin: 1,
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
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
          padding: 2,
        }}
      >
        <Typography
          textAlign={"center"}
          fontSize="1 rem"
          sx={{
            fontFamily: "monospace",
            color: "grey",
            textWrap: "nowrap",
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
            textTransform: "none",
            textDecoration: "none",
            fontWeight: "bold",
            textAlign: "center",
            width: { xs: "100%", sm: "280px" },
            textOverflow: "ellipsis",
          }}
        >
          GITHUB WEBSITE
        </Button>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <Link to={`/user/${userName}`}>
            <Button variant="contained">View Profile</Button>
          </Link>
          <Link to={`/user/${userName}?tab=repositories`}>
            <Button variant="contained">Repositories</Button>
          </Link>
        </Box>
      </Box>
    </Paper>
  );
};

export default UserCards;
