import { useQuery } from "@tanstack/react-query";
import { githubGraphQL } from "../helper/githubFetch";
import { CONTRIBUTIONS_QUERY } from "../constants/graphqlQueries";
import type { ContributionCalendarResponse } from "../constants/common.types";

const useFetchContributionInfo = (username: string) => {
  const result = useQuery({
    queryKey: ["contributionInfo", username],
    queryFn: () =>
      githubGraphQL<ContributionCalendarResponse>(CONTRIBUTIONS_QUERY, {
        login: username,
      }),
    enabled: !!username,
    staleTime: 1000 * 60 * 5,
  });

  return result;
};

export default useFetchContributionInfo;
