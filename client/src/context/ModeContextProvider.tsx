import { useState } from "react";
import backgroundContext from "./modeContext";
import type { ModeType } from "../constants/common.types";

const ModeContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [mode, setMode] = useState<ModeType>("dark");
  console.log(`Mode changed to: ${mode}`);
  return (
    <backgroundContext.Provider value={{ mode, setMode }}>
      {children}
    </backgroundContext.Provider>
  );
};
export default ModeContextProvider;
