import { useQuery } from "@tanstack/react-query";
import { githubFetch } from "../helper/githubFetch";
import type { GitHubApiUser } from "../constants/common.types";

const useFetchRepositories = (username: string) => {
  const repoQuery = useQuery({
    queryKey: ["public_repos", username],
    queryFn: () =>
      githubFetch<GitHubApiUser>(`https://api.github.com/users/${username}`),
    enabled: !!username,
    staleTime: 1000 * 60 * 5, // 5 mins
  });
  return repoQuery;
};
export default useFetchRepositories;
