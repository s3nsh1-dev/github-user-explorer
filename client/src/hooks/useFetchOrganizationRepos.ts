import { useQuery } from "@tanstack/react-query";
import { githubFetch } from "../helper/githubFetch";
import { orgReposUrl } from "../helper/githubUrls";
import { qk } from "../constants/queryKeys";
import { OrganizationTop10ReposSchema } from "../constants/schemas";
import type { OrganizationTop10ReposType } from "../constants/common.types";
import type { GitHubError } from "../helper/githubErrors";

const useFetchOrganizationRepos = (username: string) => {
  const result = useQuery<OrganizationTop10ReposType, GitHubError>({
    queryKey: qk.orgRepos(username),
    queryFn: () =>
      githubFetch(orgReposUrl(username), OrganizationTop10ReposSchema),
    enabled: !!username,
  });

  return result;
};

export default useFetchOrganizationRepos;
