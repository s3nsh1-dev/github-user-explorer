import { useInfiniteQuery } from "@tanstack/react-query";
import { githubFetch } from "../helper/githubFetch";
import { searchUsersUrl } from "../helper/githubUrls";
import { qk } from "../constants/queryKeys";
import { UserSearchResultSchema } from "../constants/schemas";

const USERS_PER_PAGE = 20;

const useInfiniteUsers = (query: string) => {
  // `initialPageParam: 1` is what types `pageParam` as a number — React Query
  // infers the rest, so no generics are needed here.
  return useInfiniteQuery({
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
