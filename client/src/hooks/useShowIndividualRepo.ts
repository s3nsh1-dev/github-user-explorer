import { useQuery } from "@tanstack/react-query";

const gitHub_authentication_token = import.meta.env
  .VITE_GITHUB_AUTHENTICATION_TOKEN;

type UseShowIndividualRepoProps = {
  username: string;
  repoName: string;
};

const useShowIndividualRepo = ({
  username,
  repoName,
}: UseShowIndividualRepoProps) => {
  const { data, isLoading, error } = useQuery({
    queryKey: [repoName, "keyIsUnique"],
    queryFn: async () => {
      if (!username || !repoName)
        throw new Error("username or repoName is required");
      const response = await fetch(
        `https://api.github.com/repos/${username}/${repoName}`,
        {
          headers: {
            Authorization: `Bearer ${gitHub_authentication_token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch Individual repo from GitHub API");
      }
      return await response.json();
    },
    enabled: !!repoName && !!username,
    staleTime: 1000 * 60 * 5,
  });
  return { data, isLoading, error };
};

export default useShowIndividualRepo;
