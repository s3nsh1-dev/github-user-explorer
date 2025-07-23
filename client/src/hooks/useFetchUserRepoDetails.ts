import { useQuery } from "@tanstack/react-query";

const gitHub_authentication_token = import.meta.env
  .VITE_GITHUB_AUTHENTICATION_TOKEN;

const useFetchUserRepoDetails = ({
  username,
  page,
}: {
  username: string;
  page: number;
}) => {
  const {
    data: reposData,
    isLoading: reposLoading,
    error: reposError,
  } = useQuery({
    queryKey: ["userRepos", username],
    queryFn: async () => {
      const perPage = 8;
      if (!username) throw new Error("Username is required");
      const response = await fetch(
        `https://api.github.com/users/${username}/repos?per_page=${perPage}&page=${page}`,
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
