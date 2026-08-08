import { useQuery } from "@tanstack/react-query";
import { githubFetch } from "../helper/githubFetch";
import { repoUrl } from "../helper/githubUrls";
import { qk } from "../constants/queryKeys";
import { GitHubRepoSchema } from "../constants/schemas";
import type { GitHubRepo } from "../constants/common.types";
import type { GitHubError } from "../helper/githubErrors";

type UseShowIndividualRepoProps = {
  username: string;
  repoName: string;
};

const useShowIndividualRepo = ({
  username,
  repoName,
}: UseShowIndividualRepoProps) => {
  return useQuery<GitHubRepo, GitHubError>({
    queryKey: qk.repo(username, repoName),
    queryFn: () => {
      if (!username || !repoName)
        throw new Error("username or repoName is required");
      return githubFetch(repoUrl(username, repoName), GitHubRepoSchema);
    },
    enabled: !!repoName && !!username,
  });
};

export default useShowIndividualRepo;
