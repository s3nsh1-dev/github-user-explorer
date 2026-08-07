import { useQuery } from "@tanstack/react-query";
import { githubFetch } from "../helper/githubFetch";
import { repoUrl } from "../helper/githubUrls";
import { qk } from "../constants/queryKeys";
import type { GitHubRepo } from "../constants/common.types";

type UseShowIndividualRepoProps = {
  username: string;
  repoName: string;
};

const useShowIndividualRepo = ({
  username,
  repoName,
}: UseShowIndividualRepoProps) => {
  const { data, isLoading, error } = useQuery({
    queryKey: qk.repo(username, repoName),
    queryFn: () => {
      if (!username || !repoName)
        throw new Error("username or repoName is required");
      return githubFetch<GitHubRepo>(repoUrl(username, repoName));
    },
    enabled: !!repoName && !!username,
    staleTime: 1000 * 60 * 5,
  });
  return { data, isLoading, error };
};

export default useShowIndividualRepo;
