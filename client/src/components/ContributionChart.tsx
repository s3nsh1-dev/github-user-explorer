import useFetchContributionInfo from "../hooks/useFetchContributionInfo";
import { Box, Typography } from "@mui/material";

const ContributionChart = () => {
  const { data, isLoading, error } = useFetchContributionInfo({
    username: "s3nsh1-dev",
  });
  if (!data) return null;

  const totalContributions =
    data.data.user.contributionsCollection.contributionCalendar
      .totalContributions;
  const weeks =
    data.data.user.contributionsCollection.contributionCalendar.weeks;

  console.log("weeks: ", weeks);

  const renderContributionChart = weeks.map((week, index) => {
    return (
      <Box
        key={index}
        sx={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "start",
          alignItems: "start",
          // backgroundColor: "red",
        }}
      >
        {week.contributionDays.map((day) => {
          return (
            <Box
              sx={{ backgroundColor: day.color, width: "20px", height: "20px" }}
            >
              {day.contributionCount}
            </Box>
          );
        })}
      </Box>
    );
    // return contributionDays.map((day) => {
    //   return (
    //     <Box key={day.date} sx={{ display: "flex", flexDirection: "column" }}>
    //       {/* {day.date} */}
    // <Box
    //   sx={{ backgroundColor: day.color, width: "20px", height: "20px" }}
    // >
    //   {day.contributionCount}
    // </Box>
    //     </Box>
    //   );
    // });
  });

  if (isLoading) return <div>....Loading</div>;
  if (error) return <div>Error Message: {error.message}</div>;

  return (
    <Box>
      <Typography>Total Contributions: {totalContributions}</Typography>
      <Box sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
        {renderContributionChart}
      </Box>
    </Box>
  );
};

export default ContributionChart;
