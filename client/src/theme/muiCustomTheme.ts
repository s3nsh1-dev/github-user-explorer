import { createTheme } from "@mui/material/styles";
import type { ModeType } from "../constants/common.types";

export const getTheme = (mode: ModeType) =>
  createTheme({
    typography: {},
    palette: {
      mode,
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
      /**
       * A visible focus ring on every MUI control, in one place.
       *
       * MUI's default `.Mui-focusVisible` on an IconButton is a 4%-opacity
       * background tint — technically a state change, but not something you
       * can find on a page. Keyboard users had four pagination arrows, a back
       * button, a star toggle and a dropdown that all looked identical
       * focused and unfocused. The accent colours are the ones the app
       * already uses for its active/hover state.
       *
       * `PageButton` opts out with its own inset shadow: its diamond
       * `clipPath` cuts an outline away, and only a shadow drawn inside the
       * shape survives.
       */
      MuiButtonBase: {
        styleOverrides: {
          root: {
            "&.Mui-focusVisible": {
              outline: `3px solid ${mode === "dark" ? "#FFD63A" : "#16610E"}`,
              outlineOffset: "2px",
            },
          },
        },
      },
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
      /**
       * MUI's default primary/info blues are tuned for white, not for this
       * app's #f5f5f5 paper: an outlined `primary` chip measured 4.18:1 and an
       * `info` one 3.51:1 on the repository page, both under 4.5:1. Only the
       * light theme needs it — the dark palette's lighter blues pass
       * comfortably. report/suggestions/09 §9f.
       */
      MuiChip: {
        styleOverrides: {
          outlined:
            mode === "light"
              ? {
                  "&.MuiChip-colorPrimary": {
                    color: "#0d47a1",
                    borderColor: "#0d47a1",
                  },
                  "&.MuiChip-colorInfo": {
                    color: "#01579b",
                    borderColor: "#01579b",
                  },
                }
              : {},
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
