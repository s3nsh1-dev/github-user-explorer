import backgroundContext from "../context/modeContext";
import { useContext } from "react";

const useMode = () => {
  const modeContext = useContext(backgroundContext);
  if (!modeContext) {
    throw new Error("Mode Context is null");
  }
  const { mode, handleSettingMode } = modeContext;
  return { mode, handleSettingMode };
};

export default useMode;
