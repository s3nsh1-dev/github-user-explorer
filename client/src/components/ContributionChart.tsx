import useFetchContributionInfo from "../hooks/useFetchContributionInfo";
import UserContributions from "./UserContributions";
import OrganizationTopRepos from "./OrganizationTopRepos";
import LoadingSkeleton from "./LoadingSkeleton";
import { Box, CircularProgress } from "@mui/material";

const ContributionChart = ({ username }: { username: string }) => {
  const { data, isLoading, error, loginType } = useFetchContributionInfo({
    username,
  });

  if (!data) return null;

  if (loginType === "User" && isLoading) {
    return <LoadingSkeleton />;
  }

  if (loginType === "Organization" && isLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return loginType === "User" ? (
    <UserContributions data={data} isLoading={isLoading} error={error} />
  ) : (
    <OrganizationTopRepos data={data} isLoading={isLoading} error={error} />
  );
};

export default ContributionChart;
