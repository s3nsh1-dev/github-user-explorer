import { useQuery } from "@tanstack/react-query";
import { githubGraphQL } from "../helper/githubFetch";
import { CONTRIBUTIONS_QUERY } from "../constants/graphqlQueries";
import { qk } from "../constants/queryKeys";
import { ContributionCalendarResponseSchema } from "../constants/schemas";
import type { ContributionCalendarResponse } from "../constants/common.types";
import type { GitHubError } from "../helper/githubErrors";

const useFetchContributionInfo = (username: string) => {
  const result = useQuery<ContributionCalendarResponse, GitHubError>({
    queryKey: qk.contributions(username),
    queryFn: () =>
      githubGraphQL(
        CONTRIBUTIONS_QUERY,
        { login: username },
        ContributionCalendarResponseSchema
      ),
    enabled: !!username,
    staleTime: 1000 * 60 * 5,
  });

  return result;
};

export default useFetchContributionInfo;
