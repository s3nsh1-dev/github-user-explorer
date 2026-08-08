import { IconButton } from "@mui/material";
import type { FC, ReactNode } from "react";
import { Link as RouterLink } from "react-router-dom";

type PageProps = {
  link: string;
  icon: ReactNode;
  disabled: boolean;
  /**
   * Required, not optional. An icon-only button has no accessible name at
   * all — a screen reader announces "button" and nothing else, four times in
   * a row for the four arrows.
   */
  label: string;
};

const PageQuickButtons: FC<PageProps> = ({ link, icon, disabled, label }) => {
  // An anchor has no `disabled` attribute, and `pointer-events: none` would
  // leave it keyboard-reachable and activatable with Enter — a worse bug than
  // the one being fixed. A disabled arrow is genuinely not a link to
  // anywhere, so it renders as a plain disabled button and drops out of the
  // tab order on its own.
  if (disabled) {
    return (
      <IconButton disabled aria-label={label}>
        {icon}
      </IconButton>
    );
  }

  // A real <a href>: ⌘-click and middle-click open a new tab, the destination
  // shows in the status bar, and the role is `link` rather than `button`.
  // RouterLink, never component="a" — a raw href would reload the whole SPA.
  return (
    <IconButton component={RouterLink} to={link} aria-label={label}>
      {icon}
    </IconButton>
  );
};

export default PageQuickButtons;
