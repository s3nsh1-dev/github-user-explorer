import { useQuery } from "@tanstack/react-query";
import { githubFetch } from "../helper/githubFetch";
import type { Repo } from "../constants/common.types";

const useFetchReposPerPage = ({
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
    queryKey: ["userRepos", username, page],
    queryFn: () => {
      const perPage = 8;
      if (!username) throw new Error("Username is required");
      return githubFetch<Repo[]>(
        `https://api.github.com/users/${username}/repos?per_page=${perPage}&page=${page}`
      );
    },
    enabled: !!username,
    // staleTime: 1000 * 60 * 5,
  });
  return {
    reposData,
    reposLoading,
    reposError,
  };
};

export default useFetchReposPerPage;
