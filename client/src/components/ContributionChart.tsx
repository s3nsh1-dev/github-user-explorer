import useFetchContributionInfo from "../hooks/useFetchContributionInfo";
import { Box } from "@mui/material";

const ContributionChart = () => {
  const { data, isLoading, error } = useFetchContributionInfo({
    username: "s3nsh1-dev",
  });
  console.log("Contribution Data", data);
  console.log("Contribution Loading", isLoading);
  console.log("Contribution Error", error);
  return <Box>i am making contribution chart</Box>;
};

export default ContributionChart;
