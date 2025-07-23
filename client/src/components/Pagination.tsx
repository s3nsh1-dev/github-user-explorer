import Box from "@mui/material/Box";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import PageButton from "./PageButton";
import type { PaginationProps } from "../constants/common.types";
import PageQuickButtons from "./PageQuickButtons";

const Pagination: React.FC<PaginationProps> = ({
  page,
  username,
  totalRepos,
  changePageNumber,
}) => {
  const totalPages = Math.ceil(totalRepos / 8);
  const renderNumericButtons = <PageButton username={username} pageNum={1} />;

  return (
    <>
      <Box
        gap={1}
        mt={4}
        mb={2}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <PageQuickButtons
          link={`/user/${username}?tab=repositories&page=${1}`}
          icon={<FirstPageIcon />}
          disabled={page === 1}
          changePageNumber={changePageNumber}
          pageNumber={1}
        />
        <PageQuickButtons
          link={`/user/${username}?tab=repositories&page=${page - 1}`}
          icon={<KeyboardArrowLeftIcon />}
          disabled={page === 1}
          changePageNumber={changePageNumber}
          pageNumber={parseInt(`${page - 1}`, 10)}
        />
        {renderNumericButtons}
        <PageQuickButtons
          link={`/user/${username}?tab=repositories&page=${page + 1}`}
          icon={<KeyboardArrowRightIcon />}
          disabled={page === totalPages}
          changePageNumber={changePageNumber}
          pageNumber={parseInt(`${page + 1}`, 10)}
        />
        <PageQuickButtons
          link={`/user/${username}?tab=repositories&page=${totalPages}`}
          icon={<LastPageIcon />}
          disabled={page === totalPages}
          changePageNumber={changePageNumber}
          pageNumber={totalPages}
        />
      </Box>
    </>
  );
};

export default Pagination;
