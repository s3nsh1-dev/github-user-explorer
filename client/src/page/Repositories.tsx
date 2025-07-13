import useFetchUserRepoDetails from "../hooks/useFetchUserRepoDetails";
import { useParams, useSearchParams } from "react-router-dom";
import { useMemo } from "react";
import UserProfileRepos from "../components/UserProfileRepos";
import Pagination from "../components/Pagination";
import { Box } from "@mui/material";

const Repositories = () => {
  const { username } = useParams();
  const [searchParams] = useSearchParams();
  const { reposData, reposLoading, reposError } = useFetchUserRepoDetails({
    username: username || "demoUserName",
  });

  const currentPageNumber = parseInt(searchParams.get("page") || "1", 10);
  console.log("currentPageNumber", currentPageNumber);
  const reposPerPage = 8;
  const startIndex = (currentPageNumber - 1) * reposPerPage;
  const endIndex = startIndex + reposPerPage;
  const repos = useMemo(
    () => (Array.isArray(reposData) ? reposData : []),
    [reposData]
  );
  const paginatedRepos = repos.slice(startIndex, endIndex);

  if (reposLoading) return <div>Loading...</div>;
  if (reposError) return <div>Error: {reposError.message}</div>;

  console.log("repos", reposData);
  return (
    <Box maxWidth={1000} mx="auto" px={3} py={1}>
      <UserProfileRepos
        repos={paginatedRepos}
        totalRepos={reposData.length}
        username={username || "demoUserName"}
      />
      <Pagination
        repos={repos}
        reposPerPage={reposPerPage}
        page={currentPageNumber}
        username={username || "demoUserName"}
      />
    </Box>
  );
};

export default Repositories;
