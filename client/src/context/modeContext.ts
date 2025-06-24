import { createContext } from "react";
import type { ModeContextType } from "../constants/common.types";

// 1. Create the context with proper type
const backgroundContext = createContext<ModeContextType | null>(null);
export default backgroundContext;
