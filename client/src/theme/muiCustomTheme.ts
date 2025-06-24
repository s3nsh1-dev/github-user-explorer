import { createTheme } from "@mui/material/styles";
import type { ModeType } from "../constants/common.types";

export const getTheme = (mode: ModeType) =>
  createTheme({
    typography: {
      fontFamily: "Roboto, Times New Roman",
      fontWeightLight: 300,
      fontWeightRegular: 400,
      fontWeightMedium: 500,
      fontWeightBold: 700,
    },
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
