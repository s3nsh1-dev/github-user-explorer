import { useQuery } from "@tanstack/react-query";
import { githubFetch } from "../helper/githubFetch";
import { usersUrl } from "../helper/githubUrls";
import { qk } from "../constants/queryKeys";
import { GitHubApiUserSchema } from "../constants/schemas";
import type { GitHubApiUser } from "../constants/common.types";
import type { GitHubError } from "../helper/githubErrors";

const useFetchRepositories = (username: string) => {
  const repoQuery = useQuery<GitHubApiUser, GitHubError>({
    queryKey: qk.userProfile(username),
    queryFn: () => githubFetch(usersUrl(username), GitHubApiUserSchema),
    enabled: !!username,
    staleTime: 1000 * 60 * 5, // 5 mins
  });
  return repoQuery;
};
export default useFetchRepositories;
