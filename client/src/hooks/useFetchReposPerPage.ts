import { useQuery } from "@tanstack/react-query";
import useFetchRepositories from "./useFetchRepositories";

const gitHub_authentication_token = import.meta.env
  .VITE_GITHUB_AUTHENTICATION_TOKEN;

const useFetchReposPerPage = ({
  username,
  page,
}: {
  username: string;
  page: number;
}) => {
  const fullRepoCall = useFetchRepositories(username);
  const {
    data: reposData,
    isLoading: reposLoading,
    error: reposError,
  } = useQuery({
    queryKey: ["userRepos", username, page],
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
    // staleTime: 1000 * 60 * 5,
  });
  return {
    reposData,
    reposLoading,
    reposError,
    totalRepos: fullRepoCall.data?.public_repos,
  };
};

export default useFetchReposPerPage;
