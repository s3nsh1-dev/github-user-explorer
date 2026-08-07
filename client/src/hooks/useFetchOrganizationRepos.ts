import { useQuery } from "@tanstack/react-query";
import { githubGraphQL } from "../helper/githubFetch";
import type { OrganizationTop10ReposType } from "../constants/common.types";

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
    queryFn: () =>
      githubGraphQL<OrganizationTop10ReposType>(
        queryBodyToFetchOrganizationTop10Repos,
        {}
      ),
    enabled: !!username,
    staleTime: 1000 * 60 * 5,
  });

  return result;
};

export default useFetchOrganizationRepos;
