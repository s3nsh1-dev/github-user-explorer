import { useQuery } from "@tanstack/react-query";
import { githubFetch } from "../helper/githubFetch";
import { contributionsUrl } from "../helper/githubUrls";
import { qk } from "../constants/queryKeys";
import { ContributionCalendarResponseSchema } from "../constants/schemas";
import type { ContributionCalendarResponse } from "../constants/common.types";
import type { GitHubError } from "../helper/githubErrors";

const useFetchContributionInfo = (username: string) => {
  const result = useQuery<ContributionCalendarResponse, GitHubError>({
    queryKey: qk.contributions(username),
    queryFn: () =>
      githubFetch(
        contributionsUrl(username),
        ContributionCalendarResponseSchema
      ),
    enabled: !!username,
  });

  return result;
};

export default useFetchContributionInfo;
