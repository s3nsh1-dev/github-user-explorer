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
        // Was the CSS keyword `grey` (#808080), which is 2.9:1 on the light
        // background and 3.9:1 on the dark one — both below 4.5:1, in both
        // themes at once. `text.secondary` is the theme's own answer to
        // "quieter than the body text but still readable".
        color: "text.secondary",
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
