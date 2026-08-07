import { useQuery } from "@tanstack/react-query";
import { githubFetch } from "../helper/githubFetch";
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
    queryKey: [repoName, "keyIsUnique"],
    queryFn: () => {
      if (!username || !repoName)
        throw new Error("username or repoName is required");
      return githubFetch<GitHubRepo>(
        `https://api.github.com/repos/${username}/${repoName}`
      );
    },
    enabled: !!repoName && !!username,
    staleTime: 1000 * 60 * 5,
  });
  return { data, isLoading, error };
};

export default useShowIndividualRepo;
