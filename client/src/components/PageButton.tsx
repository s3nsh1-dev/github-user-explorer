import { useNavigate, useSearchParams } from "react-router-dom";
import Button from "@mui/material/Button";

const PageButton = ({
  username,
  pageNum,
}: {
  username: string;
  pageNum: number;
}) => {
  const [searchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const navigate = useNavigate();

  const handlePageChange = () => {
    navigate(`/user/${username}?page=${pageNum}`);
  };

  return (
    <Button
      variant={currentPage === pageNum ? "contained" : "outlined"}
      onClick={handlePageChange}
    >
      {pageNum}
    </Button>
  );
};

export default PageButton;
