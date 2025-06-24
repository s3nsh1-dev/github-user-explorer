export type ModeType = "light" | "dark";
export type ModeContextType = {
  mode: ModeType;
  setMode: (mode: ModeType) => void;
};
