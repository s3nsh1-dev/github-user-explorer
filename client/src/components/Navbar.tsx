import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import useMode from "../hooks/useMode";
import CustomSwitchForModeTransition from "../theme/CustomSwitchForModeTransition";
import SearchBar from "./SearchBar";
import lightModeImage from "../assets/website_logo_1.png";
import darkModeImage from "../assets/website_logo_3.png";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

const MOBILE_SEARCH_PANEL_ID = "navbar-search-panel";

const Navbar = () => {
  const { mode, handleSettingMode } = useMode();
  const { pathname } = useLocation();
  const theme = useTheme();
  // Rendered rather than hidden with CSS: two <SearchBar>s in the DOM would
  // mean two fields, two autofocus targets and a duplicate id.
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  // The home page has its own hero form; a second box directly above it is
  // just noise.
  const showSearch = pathname !== "/";

  return (
    <AppBar position="static" elevation={0}>
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          gap: 1,
          paddingTop: 1,
        }}
      >
        {/* Website Logo will be displayed here */}
        <Link to="/">
          <img
            src={mode === "light" ? lightModeImage : darkModeImage}
            alt="Website Logo"
            width={120}
            height={50}
            style={{ cursor: "pointer" }}
          />
        </Link>
        {showSearch && !isMobile && (
          <SearchBar variant="compact" id="navbar-username-search" />
        )}
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          {showSearch && isMobile && (
            <IconButton
              aria-label="Search"
              aria-expanded={mobileSearchOpen}
              aria-controls={MOBILE_SEARCH_PANEL_ID}
              onClick={() => setMobileSearchOpen((open) => !open)}
            >
              <SearchIcon />
            </IconButton>
          )}
          <CustomSwitchForModeTransition
            mode={mode}
            handleSettingMode={handleSettingMode}
          />
        </Box>
      </Toolbar>
      {/* Pushes the page down instead of overlaying the toolbar — an overlay
          at 375px covers the logo and traps focus. */}
      <Collapse in={showSearch && isMobile && mobileSearchOpen} unmountOnExit>
        <Box
          id={MOBILE_SEARCH_PANEL_ID}
          onKeyDown={(event) => {
            if (event.key === "Escape") setMobileSearchOpen(false);
          }}
          sx={{ px: 2, pb: 1 }}
        >
          <SearchBar
            variant="compact"
            id="navbar-username-search"
            autoFocus
            onSubmitted={() => setMobileSearchOpen(false)}
          />
        </Box>
      </Collapse>
    </AppBar>
  );
};

export default Navbar;
