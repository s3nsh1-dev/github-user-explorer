import { Box, Button, Menu, MenuItem, FormControl } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useMode from "../hooks/useMode";
import useStarredUsers from "../hooks/useStarredUsers";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const StarredUsersMenu = () => {
  const { mode } = useMode();
  const { starredList } = useStarredUsers();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (user?: string) => {
    setAnchorEl(null);
    // The last-clicked user used to be kept in local state and shown as the
    // button's label forever, including after navigating somewhere else. The
    // chevron is always correct.
    if (user) navigate(`/user/${user}`);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Box>Starred User Profiles</Box>
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
          aria-label="Starred profiles"
          aria-haspopup="menu"
          aria-expanded={open}
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
          <KeyboardArrowDownIcon />
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
          {/* An empty dropdown that opens onto nothing is the first
              interactive element a first-time visitor meets. Say what it is
              for instead. */}
          {starredList.length === 0 ? (
            <MenuItem disabled sx={{ whiteSpace: "normal", maxWidth: 220 }}>
              Star a profile to pin it here.
            </MenuItem>
          ) : (
            starredList.map((user) => (
              <MenuItem key={user} onClick={() => handleClose(user)}>
                {user}
              </MenuItem>
            ))
          )}
        </Menu>
      </FormControl>
    </Box>
  );
};

export default StarredUsersMenu;
