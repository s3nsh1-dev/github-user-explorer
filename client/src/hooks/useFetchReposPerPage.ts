import { useQuery } from "@tanstack/react-query";
import { githubFetch } from "../helper/githubFetch";
import { userReposUrl } from "../helper/githubUrls";
import { qk } from "../constants/queryKeys";
import { RepoListSchema } from "../constants/schemas";
import type { Repo } from "../constants/common.types";
import type { GitHubError } from "../helper/githubErrors";

const REPOS_PER_PAGE = 8;

const useFetchReposPerPage = ({
  username,
  page,
}: {
  username: string;
  page: number;
}) => {
  return useQuery<Repo[], GitHubError>({
    queryKey: qk.userRepos(username, page),
    queryFn: () => {
      if (!username) throw new Error("Username is required");
      return githubFetch(
        userReposUrl(username, page, REPOS_PER_PAGE),
        RepoListSchema
      );
    },
    enabled: !!username,
    // staleTime: 1000 * 60 * 5,
  });
};

export default useFetchReposPerPage;
