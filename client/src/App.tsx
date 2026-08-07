import Home from "./page/Home";
import Explorer from "./page/Explorer";
import NotFound from "./page/NotFound";
import ShowSelectedRepo from "./page/ShowSelectedRepo";
import Navbar from "./components/Navbar";
import LinkWrapper from "./page/LinkWrapper";
import AppErrorBoundary from "./components/AppErrorBoundary";
import useMode from "./hooks/useMode";
import { getTheme } from "./theme/muiCustomTheme";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { Route, Routes, useLocation } from "react-router-dom";

const App = () => {
  const { mode } = useMode();
  const location = useLocation();
  return (
    <>
      <ThemeProvider theme={getTheme(mode)}>
        <CssBaseline />
        {/* Inside ThemeProvider so the fallback is themed, and keyed on the
            path so navigating away from a crashed page actually clears it —
            without the key, "Back to home" changes the URL and keeps
            rendering the fallback. */}
        <AppErrorBoundary key={location.pathname}>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explorer />} />
            <Route path="/user/:username" element={<LinkWrapper />} />
            <Route
              path="/user/:username/:repoName"
              element={<ShowSelectedRepo />}
            />
            {/* React Router v6+ ranks by specificity, not declaration order,
                so this worked where it was — above a more specific route. It
                was never a bug, only something every reader had to stop and
                verify. */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppErrorBoundary>
      </ThemeProvider>
    </>
  );
};

export default App;
