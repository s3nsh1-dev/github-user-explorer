import { useQuery } from "@tanstack/react-query";
import { githubGraphQL } from "../helper/githubFetch";
import type { ContributionCalendarResponse } from "../constants/common.types";

const useFetchContributionInfo = (username: string) => {
  const queryBodyToFetchUserContributionCalender = `
        {
          user(login: "${username}") {
            contributionsCollection {
              contributionCalendar {
                totalContributions
                weeks {
                  contributionDays {
                    date
                    contributionCount
                    color
                  }
                }
              }
            }
          }
        }`;
  const result = useQuery({
    queryKey: ["contributionInfo", username],
    queryFn: () =>
      githubGraphQL<ContributionCalendarResponse>(
        queryBodyToFetchUserContributionCalender,
        {}
      ),
    enabled: !!username,
    staleTime: 1000 * 60 * 5,
  });

  return result;
};

export default useFetchContributionInfo;
