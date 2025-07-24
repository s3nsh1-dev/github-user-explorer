import Box from "@mui/material/Box";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import PageButton from "./PageButton";
import type { PaginationProps } from "../constants/common.types";
import PageQuickButtons from "./PageQuickButtons";
import { useSearchParams } from "react-router-dom";

const Pagination: React.FC<PaginationProps> = ({
  page,
  username,
  totalRepos,
}) => {
  const [searchParams] = useSearchParams();
  const foo = parseInt(searchParams.get("page") || page.toString(), 10);
  const totalPages = Math.ceil(totalRepos / 8);
  // console.log("total Pages", totalPages);
  let renderNumericButtons;
  if (totalPages <= 3) {
    const pageCountArray = [];
    for (let i = 1; i <= totalPages; i++) {
      pageCountArray.push(i);
    }
    renderNumericButtons = pageCountArray.map((pages) => {
      return (
        <PageButton
          key={pages}
          username={username}
          pageNum={pages}
          active={pages === foo}
        />
      );
    });
  }
  if (totalPages > 3) {
    let pageNumberOne = 1;
    let pageNumberTwo = 2;
    let pageNumberThree = 3;
    if (foo > 1 && foo <= totalPages - 2) {
      pageNumberOne = foo;
      pageNumberTwo = foo + 1;
      pageNumberThree = foo + 2;
    } else {
      pageNumberOne = totalPages - 2;
      pageNumberTwo = totalPages - 1;
      pageNumberThree = totalPages;
    }
    renderNumericButtons = [pageNumberOne, pageNumberTwo, pageNumberThree].map(
      (pages) => {
        return (
          <PageButton
            key={pages}
            username={username}
            pageNum={pages}
            active={pages === foo}
          />
        );
      }
    );
  }

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
