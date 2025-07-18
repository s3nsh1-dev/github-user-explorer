import useFetchContributionInfo from "../hooks/useFetchContributionInfo";
import UserContributions from "./UserContributions";
import OrganizationTopRepos from "./OrganizationTopRepos";
// import LoadingSkeleton from "./LoadingSkeleton";
import { Box, CircularProgress } from "@mui/material";

const ContributionChart = ({ username }: { username: string }) => {
  const { data, isLoading, error } = useFetchContributionInfo({
    username,
  });

  const loginType = Object.keys(data?.data || "placeholder")[0];
  if (isLoading) {
    console.log("loading UI", loginType, isLoading);
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
    // return <LoadingSkeleton />;
  }

  if (!data) return null;

  return loginType === "user" ? (
    <UserContributions data={data} isLoading={isLoading} error={error} />
  ) : (
    <OrganizationTopRepos data={data} isLoading={isLoading} error={error} />
  );
};

export default ContributionChart;
