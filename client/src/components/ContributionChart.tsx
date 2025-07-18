import UserContributions from "./UserContributions";
import OrganizationTopRepos from "./OrganizationTopRepos";
import useFetchLoginType from "../hooks/useFetchLoginType";

const ContributionChart = ({ username }: { username: string }) => {
  const { data } = useFetchLoginType(username);
  if (!data) return null;
  const loginType: string = data.data.repositoryOwner?.__typename;
  console.log("GG", loginType);

  return loginType === "user" ? (
    <UserContributions username={username} />
  ) : (
    <OrganizationTopRepos username={username} />
  );
};

export default ContributionChart;
