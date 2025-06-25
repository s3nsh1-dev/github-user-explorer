import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

const Explorer = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");

  const URL = `https://api.github.com/search/users?q=${query}`;

  const { data, isLoading, error } = useQuery({
    queryKey: ["users", query],
    queryFn: async () => {
      if (!query) {
        throw new Error("Search query is required");
      }
      const response = await fetch(URL);
      if (!response.ok) {
        throw new Error("Failed to fetch data from GitHub API");
      }
      return await response.json();
    },
    enabled: !!query, // Only run the query if query is not null
  });

  if (isLoading) return <div>....Loading</div>;
  if (error) return <div>Error Message: {error.message}</div>;
  return <div>{JSON.stringify(data)}</div>;
};

export default Explorer;
