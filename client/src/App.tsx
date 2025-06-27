import Home from "./page/Home";
import Explorer from "./page/Explorer";
import ProfileInfo from "./page/ProfileInfo";
import NotFound from "./page/NotFound";
import { Route, Routes } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import useMode from "./hooks/useMode";
import { getTheme } from "./theme/muiCustomTheme";
import Navbar from "./components/Navbar";

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
          <Route path="/user/:username" element={<ProfileInfo />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ThemeProvider>
    </>
  );
};

export default App;
