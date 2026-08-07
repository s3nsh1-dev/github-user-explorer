import { useQuery } from "@tanstack/react-query";
import { githubFetch } from "../helper/githubFetch";
import { usersUrl } from "../helper/githubUrls";
import { qk } from "../constants/queryKeys";
import type { GitHubApiUser } from "../constants/common.types";

const useFetchUserData = ({ username }: { username: string }) => {
  const {
    data: userData,
    isLoading: userLoading,
    error: userError,
  } = useQuery({
    queryKey: qk.userProfile(username),
    queryFn: () => {
      if (!username) throw new Error("Username is required");
      return githubFetch<GitHubApiUser>(usersUrl(username));
    },
    enabled: !!username,
    // how long the data will be considered fresh = stale time(in this case 5min)
    staleTime: 1000 * 60 * 5,
  });
  return { userData, userLoading, userError };
};

export default useFetchUserData;
