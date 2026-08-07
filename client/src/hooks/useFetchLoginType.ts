import { useQuery } from "@tanstack/react-query";
import { githubGraphQL } from "../helper/githubFetch";
import type { LoginTypeResponse } from "../constants/common.types";

const useFetchLoginType = (username: string) => {
  const queryBodyToFetchLoginType = `
      {
        repositoryOwner(login: "${username}") {
          __typename
        }
      }`;
  const fetchedData = useQuery({
    queryKey: [username, "loginType"],
    queryFn: () =>
      githubGraphQL<LoginTypeResponse>(queryBodyToFetchLoginType, {}),
    enabled: !!username,
    staleTime: 1000 * 60 * 5,
  });
  return fetchedData;
};
export default useFetchLoginType;
