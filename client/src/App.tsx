import Home from "./page/Home";
import Explorer from "./page/Explorer";
import ProfileInfo from "./page/ProfileInfo";
import NotFound from "./page/NotFound";
import { Route, Routes } from "react-router-dom";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explorer />} />
        <Route path="/profile-info" element={<ProfileInfo />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;
