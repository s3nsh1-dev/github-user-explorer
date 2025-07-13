import useFetchUserRepoDetails from "../hooks/useFetchUserRepoDetails";
import { useParams, useSearchParams } from "react-router-dom";
import { useMemo } from "react";
import UserProfileRepos from "../components/UserProfileRepos";
import Pagination from "../components/Pagination";

const Repositories = () => {
  const { username } = useParams();
  const [searchParams] = useSearchParams();
  const { reposData, reposLoading, reposError } = useFetchUserRepoDetails({
    username: username || "demoUserName",
  });

  const currentPageNumber = parseInt(searchParams.get("page") || "1", 10);
  console.log("currentPageNumber", currentPageNumber);
  const reposPerPage = 6;
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
    <div>
      <UserProfileRepos repos={paginatedRepos} />
      <Pagination
        repos={repos}
        reposPerPage={reposPerPage}
        page={currentPageNumber}
        username={username || "unknown"}
      />
    </div>
  );
};

export default Repositories;
