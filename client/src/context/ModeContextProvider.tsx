import { useState } from "react";
import backgroundContext from "./modeContext";
import type { ModeType } from "../constants/common.types";
import { readMode, writeMode } from "../helper/storage";

const ModeContextProvider = ({ children }: { children: React.ReactNode }) => {
  // `readMode` as a lazy initialiser: storage is read once at mount, not on
  // every render. It also *checks* the stored value instead of asserting it —
  // `localStorage.getItem("mode") as ModeType` let a stored "purple" through
  // and produced a half-dark theme, since the app compares against "dark" in
  // some places and "light" in others.
  const [mode, setMode] = useState<ModeType>(readMode);

  const handleSettingMode = (newMode: ModeType) => {
    setMode(newMode);
    writeMode(newMode);
  };

  return (
    <backgroundContext.Provider value={{ mode, handleSettingMode }}>
      {children}
    </backgroundContext.Provider>
  );
};
export default ModeContextProvider;
