import { useQuery } from "@tanstack/react-query";
import { githubGraphQL } from "../helper/githubFetch";
import { OWNER_TYPE_QUERY } from "../constants/graphqlQueries";
import { qk } from "../constants/queryKeys";
import type { LoginTypeResponse } from "../constants/common.types";

const useFetchLoginType = (username: string) => {
  const fetchedData = useQuery({
    queryKey: qk.ownerType(username),
    queryFn: () =>
      githubGraphQL<LoginTypeResponse>(OWNER_TYPE_QUERY, { login: username }),
    enabled: !!username,
    staleTime: 1000 * 60 * 5,
  });
  return fetchedData;
};
export default useFetchLoginType;
