import backgroundContext from "../context/modeContext";
import { useContext } from "react";

const useMode = () => {
  const context = useContext(backgroundContext);
  if (!context) return;
  const { mode, setMode } = context;
  return { mode, setMode };
};

export default useMode;
