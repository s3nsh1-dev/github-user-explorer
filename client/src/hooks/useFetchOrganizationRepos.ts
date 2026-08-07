import { useQuery } from "@tanstack/react-query";
import { githubGraphQL } from "../helper/githubFetch";
import { ORG_TOP_REPOS_QUERY } from "../constants/graphqlQueries";
import { qk } from "../constants/queryKeys";
import type { OrganizationTop10ReposType } from "../constants/common.types";

const useFetchOrganizationRepos = (username: string) => {
  const result = useQuery({
    queryKey: qk.orgRepos(username),
    queryFn: () =>
      githubGraphQL<OrganizationTop10ReposType>(ORG_TOP_REPOS_QUERY, {
        login: username,
      }),
    enabled: !!username,
    staleTime: 1000 * 60 * 5,
  });

  return result;
};

export default useFetchOrganizationRepos;
