import { useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import useMode from "../hooks/useMode";

const PageButton = ({
  username,
  pageNum,
}: {
  username: string;
  pageNum: number;
}) => {
  const { mode } = useMode();
  const navigate = useNavigate();

  const handlePageChange = () => {
    navigate(`/user/${username}?tab=repositories&page=${pageNum}`);
  };

  return (
    <IconButton
      onClick={handlePageChange}
      sx={{
        height: 30,
        width: 30,
        fontSize: "10px",
        border: `1px solid ${mode === "dark" ? "white" : "black"}`,
        color: mode === "dark" ? "white" : "black",
      }}
    >
      {pageNum}
    </IconButton>
  );
};

export default PageButton;
