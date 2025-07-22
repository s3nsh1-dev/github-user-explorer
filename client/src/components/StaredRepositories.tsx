import { Box, Button, Menu, MenuItem, FormControl } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useMode from "../hooks/useMode";
import useStartedUserList from "../hooks/useStaredUserList";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const StaredRepositories = () => {
  const { mode } = useMode();
  const staredUserList = useStartedUserList();
  const staredList = staredUserList?.staredList ?? [];

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [selectValue, setSelectValue] = useState<string>("");
  const navigate = useNavigate();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (user?: string) => {
    setAnchorEl(null);
    if (user) {
      setSelectValue(user);
      navigate(`/user/${user}`);
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
        <Button
          onClick={handleClick}
          sx={{
            display: "flex",
            justifyContent: "end",
            width: "100%",
            padding: "8px",
            borderRadius: "4px",
            backgroundColor: mode === "dark" ? "#23272b" : "#e0e0e0",
            color: mode === "dark" ? "white" : "#23272b",
          }}
        >
          {selectValue || <KeyboardArrowDownIcon />}
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={() => handleClose()}
          slotProps={{
            paper: {
              sx: {
                gap: 0,
                maxHeight: 150, // 🎯 Limit dropdown height
                overflow: "auto",
                backgroundColor: mode === "dark" ? "#23272b" : "#e0e0e0",
                color: mode === "dark" ? "white" : "#23272b",
              },
            },
          }}
        >
          {staredList.map((user) => (
            <MenuItem key={user} onClick={() => handleClose(user)}>
              {user}
            </MenuItem>
          ))}
        </Menu>
      </FormControl>
    </Box>
  );
};

export default StaredRepositories;
