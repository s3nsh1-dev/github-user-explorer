import { useQuery } from "@tanstack/react-query";

const TOKEN = import.meta.env.VITE_GITHUB_AUTHENTICATION_TOKEN;

const useFetchContributionInfo = ({ username }: { username: string }) => {
  const result = useQuery({
    queryKey: ["contributionInfo", username],
    queryFn: async () => {
      // STEP 1: Detect login type
      const typeQuery = `
      {
        repositoryOwner(login: "${username}") {
          __typename
        }
      }`;

      const typeResponse = await fetch("https://api.github.com/graphql", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: typeQuery }),
      });

      if (!typeResponse.ok) {
        throw new Error("Failed to detect login type");
      }

      const typeData = await typeResponse.json();
      console.log("typeData", typeData);
      const loginType = typeData.data.repositoryOwner?.__typename;

      if (!loginType) {
        throw new Error("User or organization not found");
      }

      // STEP 2: Build appropriate query
      let dataQuery = "";
      if (loginType === "User") {
        dataQuery = `
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
      } else if (loginType === "Organization") {
        // Optional: Fetch org repos instead
        dataQuery = `
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

      return await dataResponse.json();
    },
    enabled: !!username,
    staleTime: 1000 * 60 * 5,
  });

  return result;
};

export default useFetchContributionInfo;
