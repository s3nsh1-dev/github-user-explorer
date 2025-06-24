import { useState } from "react";
import backgroundContext from "./modeContext";
import type { ModeType } from "../constants/common.types";

const ModeContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [mode, setMode] = useState<ModeType>("dark");
  return (
    <backgroundContext.Provider value={{ mode, setMode }}>
      {children}
    </backgroundContext.Provider>
  );
};
export default ModeContextProvider;
