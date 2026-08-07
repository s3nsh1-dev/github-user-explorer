import { useParams, useSearchParams } from "react-router-dom";
import Pagination from "../components/Pagination";
import DisplayRepoList from "../components/DisplayRepoList";
import useFetchRepositories from "../hooks/useFetchRepositories";

const Repositories = () => {
  const { username } = useParams();
  const [searchParams] = useSearchParams();
  const pNum = parseInt(searchParams.get("page") || "1", 10);
  const fullRepoCall = useFetchRepositories(username || "demoUserName");
  // The hook is typed as of P05, so `public_repos` is now visibly optional.
  // Handling that absence (and the NaN it feeds into Pagination) is P15; the
  // assertion keeps this plan transport-only and changes nothing at runtime.
  const totalRepos = fullRepoCall.data?.public_repos as number;

  return (
    <>
      <DisplayRepoList totalRepos={totalRepos} />
      <Pagination
        page={pNum}
        username={username || "demoUserName"}
        totalRepos={totalRepos}
      />
    </>
  );
};

export default Repositories;
