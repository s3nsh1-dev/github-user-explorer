import { useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import useMode from "../hooks/useMode";

const PageButton = ({
  username,
  pageNum,
  active,
}: {
  username: string;
  pageNum: number;
  active: boolean;
}) => {
  const { mode } = useMode();
  const style = {
    height: 30,
    width: 30,
    fontSize: "10px",
    color: active
      ? mode === "dark"
        ? "#e0e0e0"
        : "#23272b"
      : mode === "dark"
      ? "#23272b"
      : "#e0e0e0",
    backgroundColor: active
      ? mode === "dark"
        ? "green"
        : "#FFD700"
      : mode === "dark"
      ? "#e0e0e0"
      : "#23272b",
    clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    transition: "background 0.2s",
    "&:hover": {
      backgroundColor: mode === "dark" ? "green" : "#FFD700",
      color: mode === "dark" ? "#e0e0e0" : "#23272b",
    },
  };

  const navigate = useNavigate();
  const handlePageChange = () => {
    navigate(`/user/${username}?tab=repositories&page=${pageNum}`);
  };

  return (
    <IconButton onClick={handlePageChange} sx={style}>
      {pageNum}
    </IconButton>
  );
};

export default PageButton;
