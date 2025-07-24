import { useParams, useSearchParams } from "react-router-dom";
import Pagination from "../components/Pagination";
import DisplayRepoList from "../components/DisplayRepoList";
import useFetchRepositories from "../hooks/useFetchRepositories";

const Repositories = () => {
  const { username } = useParams();
  const [searchParams] = useSearchParams();
  const pNum = parseInt(searchParams.get("page") || "1", 10);
  const fullRepoCall = useFetchRepositories(username || "demoUserName");
  const totalRepos = fullRepoCall.data?.public_repos;

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
