import { useQuery } from "@tanstack/react-query";
import useFetchLoginType from "./useFetchLoginType";

const TOKEN = import.meta.env.VITE_GITHUB_AUTHENTICATION_TOKEN;

const useFetchContributionInfo = ({ username }: { username: string }) => {
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
  const queryBodyToFetchOrganizationTop10Repos = `
        {
          organization(login: "${username}") {
            repositories(first: 10, orderBy: {field: UPDATED_AT, direction: DESC}) {
              nodes {
                name
                description
                stargazerCount
                updatedAt
              }
            }
          }
        }`;

  const typeResponse = useFetchLoginType(username);
  const result = useQuery({
    queryKey: ["contributionInfo", username],
    queryFn: async () => {
      const loginType = typeResponse.data.data.repositoryOwner?.__typename;

      if (!loginType) {
        throw new Error("User or organization not found");
      }

      let dataQuery = "";
      if (loginType === "User") {
        dataQuery = queryBodyToFetchUserContributionCalender;
      } else if (loginType === "Organization") {
        dataQuery = queryBodyToFetchOrganizationTop10Repos;
      }

      // STEP 3: Fetch actual data
      const dataResponse = await fetch("https://api.github.com/graphql", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: dataQuery }),
      });

      if (!dataResponse.ok) {
        throw new Error("Failed to fetch contribution or repo data");
      }

      const data = await dataResponse.json();
      return data;
    },
    enabled: !!username,
    staleTime: 1000 * 60 * 5,
  });

  return result;
};

export default useFetchContributionInfo;
