import { useQuery } from "@tanstack/react-query";
import { githubFetch } from "../helper/githubFetch";
import { usersUrl } from "../helper/githubUrls";
import { qk } from "../constants/queryKeys";
import { GitHubApiUserSchema } from "../constants/schemas";
import type { GitHubApiUser } from "../constants/common.types";
import type { GitHubError } from "../helper/githubErrors";

const useFetchUserData = ({ username }: { username: string }) => {
  // The whole UseQueryResult, not three fields: `refetch` is what P13's Retry
  // button needs, and `isFetching` / `isPlaceholderData` are what tell a paged
  // list apart from a cold load.
  return useQuery<GitHubApiUser, GitHubError>({
    queryKey: qk.userProfile(username),
    queryFn: () => {
      if (!username) throw new Error("Username is required");
      return githubFetch(usersUrl(username), GitHubApiUserSchema);
    },
    enabled: !!username,
  });
};

export default useFetchUserData;
