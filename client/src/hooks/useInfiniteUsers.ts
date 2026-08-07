import { useInfiniteQuery } from "@tanstack/react-query";
import type { InfiniteData } from "@tanstack/react-query";
import type { GitHubUserSearchResult } from "../constants/common.types";
import { githubFetch } from "../helper/githubFetch";
import { searchUsersUrl } from "../helper/githubUrls";
import { qk } from "../constants/queryKeys";
import { UserSearchResultSchema } from "../constants/schemas";
import type { GitHubError } from "../helper/githubErrors";

const USERS_PER_PAGE = 20;

const useInfiniteUsers = (query: string) => {
  // All five generics are spelled out so `pageParam` arrives as a number.
  // Left to default it is `unknown`, which is why the page number used to need
  // an `as number` assertion on the way into the request URL.
  return useInfiniteQuery<
    GitHubUserSearchResult,
    GitHubError,
    InfiniteData<GitHubUserSearchResult, number>,
    ReturnType<typeof qk.searchUsers>,
    number
  >({
    queryKey: qk.searchUsers(query),
    queryFn: ({ pageParam }) =>
      githubFetch(
        searchUsersUrl(query, pageParam, USERS_PER_PAGE),
        UserSearchResultSchema
      ),
    getNextPageParam: (prevPage, allPages) => {
      // total_count<count of matched user> is mentioned in every call
      const totalPages = Math.ceil(prevPage.total_count / USERS_PER_PAGE);
      // allpages is the array of objects containing the items aka list of names of new users
      // When this returns undefined React Query stops fetching further pages.
      const nextPageNumber =
        allPages.length < totalPages ? allPages.length + 1 : undefined;
      return nextPageNumber;
    },
    initialPageParam: 1,
    enabled: !!query,
  });
};

export default useInfiniteUsers;
