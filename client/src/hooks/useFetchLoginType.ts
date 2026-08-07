import { useQuery } from "@tanstack/react-query";
import { githubGraphQL } from "../helper/githubFetch";
import { OWNER_TYPE_QUERY } from "../constants/graphqlQueries";
import { qk } from "../constants/queryKeys";
import { LoginTypeResponseSchema } from "../constants/schemas";
import type { LoginTypeResponse } from "../constants/common.types";
import type { GitHubError } from "../helper/githubErrors";

const useFetchLoginType = (username: string) => {
  const fetchedData = useQuery<LoginTypeResponse, GitHubError>({
    queryKey: qk.ownerType(username),
    queryFn: () =>
      githubGraphQL(
        OWNER_TYPE_QUERY,
        { login: username },
        LoginTypeResponseSchema
      ),
    enabled: !!username,
  });
  return fetchedData;
};
export default useFetchLoginType;
