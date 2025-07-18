import { useQuery } from "@tanstack/react-query";

const gitHub_authentication_token = import.meta.env
  .VITE_GITHUB_AUTHENTICATION_TOKEN;

const useFetchUserRepoDetails = ({ username }: { username: string }) => {
  const {
    data: reposData,
    isLoading: reposLoading,
    error: reposError,
  } = useQuery({
    queryKey: ["userRepos", username],
    queryFn: async () => {
      if (!username) throw new Error("Username is required");
      const response = await fetch(
        `https://api.github.com/users/${username}/repos`,
        {
          headers: {
            Authorization: `Bearer ${gitHub_authentication_token}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch user repositories");
      return await response.json();
    },
    enabled: !!username,
    staleTime: 1000 * 60 * 5,
  });
  return { reposData, reposLoading, reposError };
};

export default useFetchUserRepoDetails;
