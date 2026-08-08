import UserContributions from "./UserContributions";
import OrganizationTopRepos from "./OrganizationTopRepos";
import LoadingSkeleton from "./LoadingSkeleton";
import ErrorState from "./ErrorState";
import useFetchLoginType from "../hooks/useFetchLoginType";

/**
 * Deciding *which* chart to render costs its own request, and this component
 * used to render `null` while that request was in flight.
 *
 * The result was a hole in the middle of the loading sequence. Three requests
 * run one after another on a cold profile — `users`, then `owner-type` (only
 * once the profile resolves and this mounts), then `contributions` — and the
 * middle one had no placeholder, so the screen went:
 *
 *   profile skeleton → **nothing** → contribution skeleton → graph
 *
 * Measured at roughly 300 ms of blank space on a normal connection. The same
 * skeleton `UserContributions` uses covers this gap, so the placeholder now
 * stays put from first paint until the graph replaces it.
 */
const ContributionChart = ({ username }: { username: string }) => {
  const { data, isLoading, error, refetch } = useFetchLoginType(username);

  if (isLoading) return <LoadingSkeleton />;
  // Without this the chart area also failed silently: a failed owner-type
  // request left `data` undefined forever, which rendered as an empty space
  // with nothing to retry.
  if (error) return <ErrorState error={error} onRetry={refetch} sx={{ mt: 2 }} />;
  if (!data) return null;

  const loginType = data.repositoryOwner?.__typename.toLowerCase();

  return loginType === "user" ? (
    <UserContributions username={username} />
  ) : (
    <OrganizationTopRepos username={username} />
  );
};

export default ContributionChart;
