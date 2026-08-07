import { useQuery } from "@tanstack/react-query";
import { githubGraphQL } from "../helper/githubFetch";
import { ORG_TOP_REPOS_QUERY } from "../constants/graphqlQueries";
import { qk } from "../constants/queryKeys";
import { OrganizationTop10ReposSchema } from "../constants/schemas";
import type { OrganizationTop10ReposType } from "../constants/common.types";
import type { GitHubError } from "../helper/githubErrors";

const useFetchOrganizationRepos = (username: string) => {
  const result = useQuery<OrganizationTop10ReposType, GitHubError>({
    queryKey: qk.orgRepos(username),
    queryFn: () =>
      githubGraphQL(
        ORG_TOP_REPOS_QUERY,
        { login: username },
        OrganizationTop10ReposSchema
      ),
    enabled: !!username,
    staleTime: 1000 * 60 * 5,
  });

  return result;
};

export default useFetchOrganizationRepos;
