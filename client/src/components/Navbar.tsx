import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import useMode from "../hooks/useMode";
import CustomSwitchForModeTransition from "../theme/CustomSwitchForModeTransition";
import lightModeImage from "../assets/website_logo_1.png";
import darkModeImage from "../assets/website_logo_2.png";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { mode, handleSettingMode } = useMode();
  return (
    <AppBar position="static" elevation={0}>
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          paddingTop: 1,
        }}
      >
        {/* Website Logo will be displayed here */}
        <Link to="/">
          <img
            src={mode === "light" ? lightModeImage : darkModeImage}
            alt="Website Logo"
            width={130}
            height={50}
            style={{ cursor: "pointer" }}
          />
        </Link>
        <CustomSwitchForModeTransition
          mode={mode}
          handleSettingMode={handleSettingMode}
        />
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
