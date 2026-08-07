import Box from "@mui/material/Box";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import PageButton from "./PageButton";
import type { PaginationProps } from "../constants/common.types";
import PageQuickButtons from "./PageQuickButtons";
import { pageWindow, totalPageCount } from "../helper/paginate";

const pageLink = (username: string, page: number) =>
  `/user/${username}?tab=repositories&page=${page}`;

const Pagination: React.FC<PaginationProps> = ({
  page,
  username,
  totalRepos,
}) => {
  const totalPages = totalPageCount(totalRepos);

  // Nothing to page through: a bar with one page on it is noise, and a bar
  // with zero pages used to be a row of arrows with no numbers between them.
  if (totalPages <= 1) return null;

  const current = Math.min(Math.max(page, 1), totalPages);
  const isFirst = current <= 1;
  const isLast = current >= totalPages;

  return (
    <Box
      component="nav"
      aria-label="Repository pages"
      gap={1}
      mt={4}
      mb={2}
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
    >
      <PageQuickButtons
        link={pageLink(username, 1)}
        icon={<FirstPageIcon />}
        disabled={isFirst}
        label="Go to first page"
      />
      <PageQuickButtons
        link={pageLink(username, Math.max(current - 1, 1))}
        icon={<KeyboardArrowLeftIcon />}
        disabled={isFirst}
        label="Previous page"
      />
      {pageWindow(current, totalPages).map((pageNum) => (
        <PageButton
          key={pageNum}
          username={username}
          pageNum={pageNum}
          active={pageNum === current}
        />
      ))}
      <PageQuickButtons
        link={pageLink(username, Math.min(current + 1, totalPages))}
        icon={<KeyboardArrowRightIcon />}
        disabled={isLast}
        label="Next page"
      />
      <PageQuickButtons
        link={pageLink(username, totalPages)}
        icon={<LastPageIcon />}
        disabled={isLast}
        label="Go to last page"
      />
    </Box>
  );
};

export default Pagination;
