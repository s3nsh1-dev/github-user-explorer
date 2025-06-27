import { createTheme } from "@mui/material/styles";
import type { ModeType } from "../constants/common.types";

export const getTheme = (mode: ModeType) =>
  createTheme({
    typography: {},
    palette: {
      mode,
      // primary: {
      //   main: "#0B1D51",
      // },
      // secondary: {
      //   main: "#ff4081",
      // },
      background: {
        default: mode === "dark" ? "#23272b" : "#e0e0e0", // dark gray for dark mode, light gray for light mode
        paper: mode === "dark" ? "#333446" : "#f5f5f5", // optional: slightly lighter for paper
      },
      text: {
        primary: mode === "light" ? "#23272b" : "#e0e0e0",
        secondary: mode === "light" ? "#555" : "#bdbdbd",
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          containedPrimary: {
            backgroundColor: mode === "light" ? "#23272b" : "#e0e0e0",
            color: mode === "light" ? "#e0e0e0" : "#23272b",
            "&:hover": {
              backgroundColor: mode === "light" ? "#FFD63A" : "#16610E",
              color: mode === "light" ? "#23272b" : "#e0e0e0",
            },
          },
          outlinedPrimary: {
            border: `2px solid ${mode === "light" ? "#23272b" : "#e0e0e0"}`,
            color: mode === "light" ? "#23272b" : "#e0e0e0",
            "&:hover": {
              backgroundColor: mode === "light" ? "#FFD63A" : "#16610E",
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: mode === "light" ? "#e0e0e0" : "#23272b",
          },
        },
      },
      MuiToolbar: {
        styleOverrides: {
          root: {
            backgroundColor: mode === "light" ? "#e0e0e0" : "#23272b",
          },
        },
      },
    },
  });
