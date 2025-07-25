import { useInfiniteQuery } from "@tanstack/react-query";
import type { QueryFunctionContext } from "@tanstack/react-query";
import type { GitHubUserSearchResult } from "../constants/common.types";

const TOKEN = import.meta.env.VITE_GITHUB_AUTHENTICATION_TOKEN;

const useInfiniteUsers = (query: string) => {
  return useInfiniteQuery<GitHubUserSearchResult>({
    queryKey: ["users", query],
    queryFn: async (context: QueryFunctionContext) => {
      /* When getNextPageParam returns undefined, React Query stops
      fetching more pages. so when the first page is being called 
      context.pageParam is undefined but not undefined which is returned 
      by getNextPageParam so query starts. But when the total page count
      is reached then the undefined returned by getNextPageParam makes
      the react query stop.
      */
      const page = (context.pageParam ?? 1) as number;
      const res = await fetch(
        `https://api.github.com/search/users?q=${query}&page=${page}&per_page=16`,
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch users");

      return res.json();
    },
    getNextPageParam: (prevPage, allPages) => {
      // total_count<count of matched user> is mentioned in every call
      const totalPages = Math.ceil(prevPage.total_count / 16);
      // allpages is the array of objects containing the items aka list of names of new users
      const nextPageNumber =
        allPages.length < totalPages ? allPages.length + 1 : undefined;
      return nextPageNumber;
    },
    initialPageParam: 1,
    enabled: !!query,
    staleTime: 1000 * 60 * 5,
  });
};

export default useInfiniteUsers;
