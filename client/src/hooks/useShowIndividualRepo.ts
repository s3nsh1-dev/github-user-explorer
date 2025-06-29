import { useQuery } from "@tanstack/react-query";

const gitHub_authentication_token = import.meta.env
  .VITE_GITHUB_AUTHENTICATION_TOKEN;

type UseShowIndividualRepoProps = {
  repoName: string;
  URL: string;
};

const useShowIndividualRepo = ({
  repoName,
  URL,
}: UseShowIndividualRepoProps) => {
  const { data, isLoading, error } = useQuery({
    queryKey: [repoName, "userRepo"],
    queryFn: async () => {
      if (!URL) throw new Error("URL is required");
      const response = await fetch(URL, {
        headers: {
          Authorization: `Bearer ${gitHub_authentication_token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch Individual repo from GitHub API");
      }
      return await response.json();
    },
    enabled: false,
    staleTime: 1000 * 60 * 5,
  });
  return { data, isLoading, error };
};

export default useShowIndividualRepo;
