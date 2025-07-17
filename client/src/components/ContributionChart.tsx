import useFetchContributionInfo from "../hooks/useFetchContributionInfo";
import UserContributions from "./UserContributions";
import OrganizationTopRepos from "./OrganizationTopRepos";

const ContributionChart = ({ username }: { username: string }) => {
  const { data, isLoading, error } = useFetchContributionInfo({
    username,
  });
  if (!data) return null;
  console.log("data", data["data"]);

  return data?.data?.user ? (
    <UserContributions data={data} isLoading={isLoading} error={error} />
  ) : (
    <OrganizationTopRepos data={data} isLoading={isLoading} error={error} />
  );
};

export default ContributionChart;
