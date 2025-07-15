import { useState } from "react";
import backgroundContext from "./modeContext";
import type { ModeType } from "../constants/common.types";

const ModeContextProvider = ({ children }: { children: React.ReactNode }) => {
  const localStorageValue = localStorage.getItem("mode") as ModeType;
  const [mode, setMode] = useState<ModeType>(localStorageValue || "light");
  const handleSettingMode = (newMode: ModeType) => {
    setMode(newMode);
    localStorage.setItem("mode", newMode);
  };
  return (
    <backgroundContext.Provider value={{ mode, handleSettingMode }}>
      {children}
    </backgroundContext.Provider>
  );
};
export default ModeContextProvider;
