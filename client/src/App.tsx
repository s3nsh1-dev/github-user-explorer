import Home from "./page/Home";
import Explorer from "./page/Explorer";
import NotFound from "./page/NotFound";
import ShowSelectedRepo from "./page/ShowSelectedRepo";
import Navbar from "./components/Navbar";
import LinkWrapper from "./page/LinkWrapper";
import ContributionChart from "./components/ContributionChart";
import useMode from "./hooks/useMode";
import { getTheme } from "./theme/muiCustomTheme";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { Route, Routes } from "react-router-dom";

const App = () => {
  console.log("app is reloaded");
  const { mode } = useMode();
  return (
    <>
      <ThemeProvider theme={getTheme(mode)}>
        <CssBaseline />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explorer />} />
          <Route path="/user/:username" element={<LinkWrapper />} />
          <Route path="*" element={<NotFound />} />
          <Route
            path="/user/:username/:repoName"
            element={<ShowSelectedRepo />}
          />
          <Route path="/contribution" element={<ContributionChart />} />
        </Routes>
      </ThemeProvider>
    </>
  );
};

export default App;
