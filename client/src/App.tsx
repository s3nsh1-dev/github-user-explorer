import { lazy, Suspense } from "react";
import Home from "./page/Home";
import NotFound from "./page/NotFound";
import Navbar from "./components/Navbar";
import AppErrorBoundary from "./components/AppErrorBoundary";
import useMode from "./hooks/useMode";
import { getTheme } from "./theme/muiCustomTheme";
import { ThemeProvider, CssBaseline, Box, Skeleton } from "@mui/material";
import { Route, Routes, useLocation } from "react-router-dom";

/**
 * Everything except the landing page is loaded on demand, so a visitor who
 * only sees the home screen no longer downloads the explorer, the profile
 * page and the repository detail page as well.
 *
 * `Home` stays static — it is the first thing rendered, and lazy-loading it
 * would add a round trip before first paint. `NotFound` stays static too, for
 * a different reason: `ProfileInfo`, `Repositories` and `ShowSelectedRepo` all
 * import it directly for invalid params, so it is in the graph regardless and
 * a `lazy()` here would split nothing.
 */
const Explorer = lazy(() => import("./page/Explorer"));
const LinkWrapper = lazy(() => import("./page/LinkWrapper"));
const ShowSelectedRepo = lazy(() => import("./page/ShowSelectedRepo"));

/** Shown only while a route chunk is in flight — usually a few milliseconds. */
const PageFallback = () => (
  <Box sx={{ maxWidth: 900, mx: "auto", p: 3 }}>
    <Skeleton variant="text" width="40%" height={48} />
    <Skeleton variant="rectangular" height={180} sx={{ mt: 2, borderRadius: 1 }} />
  </Box>
);

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
          {/* The app had no landmark at all — everything rendered into a bare
              <div id="root">, so "skip to content" and landmark navigation had
              nothing to aim at. The AppBar supplies <header> itself. */}
          <Box component="main">
            {/* Inside the boundary on purpose: a chunk that fails to download
                throws, and this is what catches it. */}
            <Suspense fallback={<PageFallback />}>
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
            </Suspense>
          </Box>
        </AppErrorBoundary>
      </ThemeProvider>
    </>
  );
};

export default App;
