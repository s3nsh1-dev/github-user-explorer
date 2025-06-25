import { createTheme } from "@mui/material/styles";
import type { ModeType } from "../constants/common.types";

export const getTheme = (mode: ModeType) =>
  createTheme({
    typography: {},
    palette: {
      mode,
      primary: {
        main: "#0B1D51",
      },
      secondary: {
        main: "#ff4081",
      },
    },
  });
