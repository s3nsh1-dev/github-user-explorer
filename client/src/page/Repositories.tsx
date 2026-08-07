import { useParams, useSearchParams } from "react-router-dom";
import Pagination from "../components/Pagination";
import DisplayRepoList from "../components/DisplayRepoList";
import ErrorState from "../components/ErrorState";
import RepoListSkeleton from "../components/skeletons/RepoListSkeleton";
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
  const { data, isLoading, error, refetch } = useFetchUserData({
    username: username || "demoUserName",
  });

  // The explicit loading branch is the actual fix, not the `?? 0` below it:
  // `public_repos` is `number | undefined`, and letting the undefined through
  // is what produced `Math.ceil(undefined / 8)` → NaN in Pagination. Nothing
  // renders a page count until there is a count.
  if (isLoading) return <RepoListSkeleton />;
  if (error) return <ErrorState error={error} onRetry={refetch} />;

  const totalRepos = data?.public_repos ?? 0;

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
