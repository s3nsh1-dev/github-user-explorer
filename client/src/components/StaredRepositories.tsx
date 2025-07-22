import { Box, FormControl } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import useMode from "../hooks/useMode";
import { useContext } from "react";
import startedUserContext from "../context/staredUsersContext";

const StaredRepositories = () => {
  const { mode } = useMode();
  const { staredList } = useContext(startedUserContext);

  console.log("rendering");

  const [selectValue, setSelectValue] = useState<string>("");
  const navigate = useNavigate();

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const savedUserName = event.target.value;
    setSelectValue(savedUserName);
    if (savedUserName) {
      navigate(`/user/${savedUserName}`);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Box>Stared User Profiles</Box>
      <FormControl
        sx={{ minWidth: 140 }}
        style={{
          padding: "0px 5px",
          border: `1px solid ${mode === "dark" ? "#e0e0e0" : "#23272b"}`,
          borderRadius: "5px",
        }}
      >
        <Box
          component="select"
          value={selectValue}
          onChange={handleChange}
          sx={{
            width: "100%",
            padding: "8px",
            borderRadius: "4px",
            fontSize: "1rem",
            border: "none",
            backgroundColor: mode === "dark" ? "#23272b" : "#e0e0e0",
            color: mode === "dark" ? "white" : "#23272b",
            "&:focus": {
              outline: "none",
              borderColor: "none",
              // boxShadow: (theme) => `0 0 0 2px ${theme.palette.primary.main}33`,
            },
          }}
        >
          <option value="" disabled>
            ✰
          </option>
          {staredList.map((user) => (
            <option key={user} value={user}>
              {user}
            </option>
          ))}
        </Box>
      </FormControl>
    </Box>
  );
};

export default StaredRepositories;
