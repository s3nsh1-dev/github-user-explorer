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
}) => {
  const totalPages = Math.ceil(totalRepos / 8);
  const pageNumberOne = page;
  const pageNumberTwo = page;
  const pageNumberThree = page;
  const renderNumericButtons = (
    <>
      <PageButton username={username} pageNum={pageNumberOne} />
      <PageButton username={username} pageNum={pageNumberTwo} />
      <PageButton username={username} pageNum={pageNumberThree} />
    </>
  );

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
        />
        <PageQuickButtons
          link={`/user/${username}?tab=repositories&page=${page - 1}`}
          icon={<KeyboardArrowLeftIcon />}
          disabled={page === 1}
        />
        {renderNumericButtons}
        <PageQuickButtons
          link={`/user/${username}?tab=repositories&page=${page + 1}`}
          icon={<KeyboardArrowRightIcon />}
          disabled={page === totalPages}
        />
        <PageQuickButtons
          link={`/user/${username}?tab=repositories&page=${totalPages}`}
          icon={<LastPageIcon />}
          disabled={page === totalPages}
        />
      </Box>
    </>
  );
};

export default Pagination;
