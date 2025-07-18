import { useQuery } from "@tanstack/react-query";

const TOKEN = import.meta.env.VITE_GITHUB_AUTHENTICATION_TOKEN;

const useFetchOrganizationRepos = (username: string) => {
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

  const result = useQuery({
    queryKey: ["contributionInfo", username],
    queryFn: async () => {
      const dataResponse = await fetch("https://api.github.com/graphql", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: queryBodyToFetchOrganizationTop10Repos }),
      });

      if (!dataResponse.ok) {
        throw new Error("Failed to fetch repo data");
      }

      const data = await dataResponse.json();
      return data;
    },
    enabled: !!username,
    staleTime: 1000 * 60 * 5,
  });

  return result;
};

export default useFetchOrganizationRepos;
