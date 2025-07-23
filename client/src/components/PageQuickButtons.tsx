import { IconButton } from "@mui/material";
import type { FC, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

type PageProps = {
  link: string;
  icon: ReactNode;
  disabled: boolean;
  changePageNumber: (value: number) => void;
  pageNumber: number;
};

const PageQuickButtons: FC<PageProps> = ({
  link,
  icon,
  disabled,
  changePageNumber,
  pageNumber,
}) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(link);
    changePageNumber(pageNumber);
  };
  return (
    <IconButton onClick={handleClick} disabled={disabled}>
      {icon}
    </IconButton>
  );
};

export default PageQuickButtons;
