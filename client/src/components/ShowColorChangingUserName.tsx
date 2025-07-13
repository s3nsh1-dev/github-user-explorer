import useMode from "../hooks/useMode";
import Typography from "@mui/material/Typography";
import type { FC } from "react";

type ShowColorChangingUserNameProps = {
  username: string;
};

const ShowColorChangingUserName: FC<ShowColorChangingUserNameProps> = ({
  username,
}) => {
  const { mode } = useMode();
  return (
    <Typography
      fontSize="1 rem"
      fontFamily="monospace"
      sx={{
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
        {username}
      </span>{" "}
      &lt;&lt;&lt;
    </Typography>
  );
};

export default ShowColorChangingUserName;
