import { useQuery } from "@tanstack/react-query";

const gitHub_authentication_token = import.meta.env
  .VITE_GITHUB_AUTHENTICATION_TOKEN;

const useFetchSearchUsers = ({ query }: { query: string }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["users", query],
    queryFn: async () => {
      if (!query) {
        throw new Error("Search query is required");
      }
      const response = await fetch(
        `https://api.github.com/search/users?q=${query}`,
        {
          headers: {
            Authorization: "Bearer " + gitHub_authentication_token,
          },
        }
      );
      console.log("fetching users matching keyword: ", query);
      if (!response.ok) {
        throw new Error("Failed to fetch data from GitHub API");
      }
      return await response.json();
    },
    enabled: !!query, // Only run the query if query is not null
    staleTime: 1000 * 60 * 5,
  });
  return { data, isLoading, error };
};

export default useFetchSearchUsers;
