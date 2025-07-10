import { useInfiniteQuery } from "@tanstack/react-query";
import type { QueryFunctionContext } from "@tanstack/react-query";
import type { GitHubUserSearchResult } from "../constants/common.types";

const TOKEN = import.meta.env.VITE_GITHUB_AUTHENTICATION_TOKEN;

const useInfiniteUsers = (query: string) => {
  return useInfiniteQuery<GitHubUserSearchResult>({
    queryKey: ["users", query],
    queryFn: async (context: QueryFunctionContext) => {
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
    getNextPageParam: (lastPage, allPages) => {
      const totalPages = Math.ceil(lastPage.total_count / 10);
      return allPages.length < totalPages ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
    enabled: !!query,
    staleTime: 1000 * 60 * 5,
  });
};

export default useInfiniteUsers;
