import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { githubFetch } from "../helper/githubFetch";
import { userReposUrl } from "../helper/githubUrls";
import { qk } from "../constants/queryKeys";
import { RepoListSchema } from "../constants/schemas";
import type { Repo } from "../constants/common.types";
import type { GitHubError } from "../helper/githubErrors";
// One page size, shared with the bar that counts the pages. It was a magic 8
// here and a magic 8 in Pagination; diverging would break paging silently.
import { PER_PAGE } from "../helper/paginate";

const useFetchReposPerPage = ({
  username,
  page,
}: {
  username: string;
  page: number;
}) => {
  return useQuery<Repo[], GitHubError>({
    queryKey: qk.userRepos(username, page),
    queryFn: () => {
      if (!username) throw new Error("Username is required");
      return githubFetch(
        userReposUrl(username, page, PER_PAGE),
        RepoListSchema
      );
    },
    enabled: !!username,
    // staleTime came from the QueryClient default now; this hook used to have
    // its own commented out, so the repositories list — the screen visitors
    // click through fastest — refetched on every page change while its six
    // siblings cached for five minutes.
    //
    // Each page is a separate cache entry, so paging is a cold load and would
    // flash a spinner. keepPreviousData holds the last page on screen until the
    // next one arrives.
    placeholderData: keepPreviousData,
  });
};

export default useFetchReposPerPage;
