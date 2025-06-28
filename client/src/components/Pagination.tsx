import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

type Repo = {
  id: number;
  name: string;
  description: string | null;
  stargazers_count: number;
};
interface PaginationProps {
  repos: Repo[];
  reposPerPage: number;
  page: number;
  username: string;
}

const Pagination: React.FC<PaginationProps> = ({
  repos,
  reposPerPage,
  page,
  username,
}) => {
  const totalPages = Math.ceil(repos.length / reposPerPage);
  const navigate = useNavigate();
  return (
    <Box gap={2} mt={4} sx={{ display: "flex", justifyContent: "center" }}>
      {[...Array(totalPages)].map((_, idx) => {
        const pageNum = idx + 1;
        return (
          <Button
            key={pageNum}
            variant={page === pageNum ? "contained" : "outlined"}
            onClick={() => navigate(`/user/${username}?page=${pageNum}`)}
          >
            {pageNum}
          </Button>
        );
      })}
    </Box>
  );
};

export default Pagination;
