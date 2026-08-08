import { useQuery } from "@tanstack/react-query";
import { githubFetch } from "../helper/githubFetch";
import { ownerTypeUrl } from "../helper/githubUrls";
import { qk } from "../constants/queryKeys";
import { LoginTypeResponseSchema } from "../constants/schemas";
import type { LoginTypeResponse } from "../constants/common.types";
import type { GitHubError } from "../helper/githubErrors";

const useFetchLoginType = (username: string) => {
  const fetchedData = useQuery<LoginTypeResponse, GitHubError>({
    queryKey: qk.ownerType(username),
    // GraphQL upstream, but the proxy owns the document — the client sends a
    // login and receives the unwrapped `data`, so the schema is unchanged.
    queryFn: () =>
      githubFetch(ownerTypeUrl(username), LoginTypeResponseSchema),
    enabled: !!username,
  });
  return fetchedData;
};
export default useFetchLoginType;
