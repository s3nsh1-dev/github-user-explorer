import { useParams, useSearchParams } from "react-router-dom";
import Pagination from "../components/Pagination";
import DisplayRepoList from "../components/DisplayRepoList";
import useFetchUserData from "../hooks/useFetchUserData";
import { parsePage } from "../helper/parsePage";

const Repositories = () => {
  const { username } = useParams();
  const [searchParams] = useSearchParams();
  const pNum = parsePage(searchParams.get("page"));
  // `useFetchRepositories` used to live here and fetched the identical URL
  // purely to read one number that the profile payload already carries. P06
  // gave the two hooks the same key, React Query deduped them, and this is the
  // same cached entry ProfileInfo reads — switching tabs costs no request.
  const fullRepoCall = useFetchUserData({
    username: username || "demoUserName",
  });
  // `public_repos` is visibly optional now that the hook is typed. Handling
  // that absence — and the NaN it feeds into Pagination — is P15; the assertion
  // keeps this plan a deletion and changes nothing at runtime.
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
