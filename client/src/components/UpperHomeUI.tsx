import StarredUsersMenu from "./StarredUsersMenu";
import Box from "@mui/material/Box";

const UpperHomeUI = () => {
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "end",
        alignItems: "end",
        paddingRight: "20px",
        marginTop: "50px",
      }}
    >
      <StarredUsersMenu />
    </Box>
  );
};

export default UpperHomeUI;
