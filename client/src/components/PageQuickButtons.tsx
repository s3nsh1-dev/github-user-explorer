import { IconButton } from "@mui/material";
import type { FC, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(link);
  };
  return (
    <IconButton onClick={handleClick} disabled={disabled} aria-label={label}>
      {icon}
    </IconButton>
  );
};

export default PageQuickButtons;
