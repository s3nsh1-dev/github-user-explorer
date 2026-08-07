import { useQuery } from "@tanstack/react-query";
import { githubFetch } from "../helper/githubFetch";
import { userReposUrl } from "../helper/githubUrls";
import { qk } from "../constants/queryKeys";
import type { Repo } from "../constants/common.types";

const REPOS_PER_PAGE = 8;

const useFetchReposPerPage = ({
  username,
  page,
}: {
  username: string;
  page: number;
}) => {
  const {
    data: reposData,
    isLoading: reposLoading,
    error: reposError,
  } = useQuery({
    queryKey: qk.userRepos(username, page),
    queryFn: () => {
      if (!username) throw new Error("Username is required");
      return githubFetch<Repo[]>(
        userReposUrl(username, page, REPOS_PER_PAGE)
      );
    },
    enabled: !!username,
    // staleTime: 1000 * 60 * 5,
  });
  return {
    reposData,
    reposLoading,
    reposError,
  };
};

export default useFetchReposPerPage;
