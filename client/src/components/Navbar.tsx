import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import useMode from "../hooks/useMode";
import CustomSwitchForModeTransition from "../theme/CustomSwitchForModeTransition";

const Navbar = () => {
  const { mode, handleSettingMode } = useMode();
  return (
    <AppBar position="static" elevation={0}>
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div></div>
        <CustomSwitchForModeTransition
          mode={mode}
          handleSettingMode={handleSettingMode}
        />
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
