import { useQuery } from "@tanstack/react-query";

const TOKEN = import.meta.env.VITE_GITHUB_AUTHENTICATION_TOKEN;

const useFetchRepositories = (username: string) => {
  const repoQuery = useQuery({
    queryKey: ["public_repos", username],
    queryFn: async () => {
      const response = await fetch(`https://api.github.com/users/${username}`, {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      });
      if (!response.ok) {
        throw new Error("Error While fetching public repo count");
      }
      const data = await response.json();
      return data;
    },
    enabled: !!username,
    staleTime: 1000 * 60 * 5, // 5 mins
  });
  return repoQuery;
};
export default useFetchRepositories;
