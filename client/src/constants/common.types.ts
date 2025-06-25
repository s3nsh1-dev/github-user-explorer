export type ModeType = "light" | "dark";

export type ModeContextType = {
  mode: ModeType;
  handleSettingMode: (mode: ModeType) => void;
};
