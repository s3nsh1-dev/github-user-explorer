import { IconButton } from "@mui/material";
import type { FC, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

type PageProps = {
  link: string;
  icon: ReactNode;
  disabled: boolean;
};

const PageQuickButtons: FC<PageProps> = ({ link, icon, disabled }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(link);
  };
  return (
    <IconButton onClick={handleClick} disabled={disabled}>
      {icon}
    </IconButton>
  );
};

export default PageQuickButtons;
