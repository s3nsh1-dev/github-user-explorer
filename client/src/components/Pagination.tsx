import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import PageButton from "./PageButton";
import Typography from "@mui/material/Typography";
import type { PaginationProps } from "../constants/common.types";

const Pagination: React.FC<PaginationProps> = ({
  repos,
  reposPerPage,
  page,
  username,
}) => {
  const totalPages = Math.ceil(repos.length / reposPerPage);
  const navigate = useNavigate();

  //page is like reflective state provided from react-router-dom change page = rerender

  const getVisiblePages = () => {
    if (totalPages <= 3) return [1, 2, 3].slice(0, totalPages);

    if (page === 1) return [1, 2, 3];
    if (page === totalPages)
      return [totalPages - 2, totalPages - 1, totalPages];
    return [page - 1, page, page + 1];
  };
  const numberOfPages = getVisiblePages().map((pageNum) => (
    <PageButton key={pageNum} username={username} pageNum={pageNum} />
  ));
  return (
    <>
      {repos.length > 0 ? (
        <Box gap={2} mt={4} sx={{ display: "flex", justifyContent: "center" }}>
          <IconButton
            onClick={() => navigate(`/user/${username}?page=${1}`)}
            disabled={page === 1}
          >
            <FirstPageIcon />
          </IconButton>
          <IconButton
            disabled={page === 1}
            onClick={() => navigate(`/user/${username}?page=${page - 1}`)}
          >
            <KeyboardArrowLeftIcon />
          </IconButton>
          {numberOfPages}
          <IconButton
            onClick={() => navigate(`/user/${username}?page=${page + 1}`)}
            disabled={page === totalPages}
          >
            <KeyboardArrowRightIcon />
          </IconButton>
          <IconButton
            disabled={page === totalPages}
            onClick={() => navigate(`/user/${username}?page=${totalPages}`)}
          >
            <LastPageIcon />
          </IconButton>
        </Box>
      ) : (
        <Typography color="textDisabled">
          Create repositories to reflect here
        </Typography>
      )}
    </>
  );
};

export default Pagination;
