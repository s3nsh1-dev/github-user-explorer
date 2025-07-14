import useFetchContributionInfo from "../hooks/useFetchContributionInfo";
import { Box, Typography } from "@mui/material";

type Week = {
  contributionDays: ContributionDay[];
};

type ContributionDay = {
  date: string; // or ""
  contributionCount: number | null;
  color: string; // hex color or "grey"
};

const ContributionChart = ({ username }: { username: string }) => {
  const { data, isLoading, error } = useFetchContributionInfo({
    username,
  });
  if (!data) return null;

  const totalContributions: number =
    data.data.user.contributionsCollection.contributionCalendar
      .totalContributions;
  const weeks: Week[] =
    data.data.user.contributionsCollection.contributionCalendar.weeks;

  // console.log("weeks: ", weeks);

  const renderContributionChart: React.ReactNode[] = weeks.map(
    (week: Week, index: number) => {
      const passingArray = week.contributionDays;
      console.log(passingArray);
      let finalPass = [...passingArray];
      if (passingArray.length < 7) {
        const missingDays = 7 - passingArray.length;
        const emptyArray = new Array(missingDays).fill({
          date: "",
          contributionCount: null,
          color: "grey",
        });
        finalPass = [...passingArray, ...emptyArray];
      }
      return (
        <Box
          key={index}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "start",
            alignItems: "start",
            gap: "1px",
          }}
        >
          {finalPass.map((day) => {
            // console.log(day);
            return (
              <Box
                sx={{
                  backgroundColor: day.color,
                  width: "20px",
                  height: "20px",
                  fontSize: "0.7rem",
                  color: "#fffff0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "10px",
                }}
              >
                {day.contributionCount}
              </Box>
            );
          })}
        </Box>
      );
    }
  );

  if (isLoading) return <div>....Loading</div>;
  if (error) return <div>Error Message: {error.message}</div>;

  return (
    <Box>
      <Typography fontFamily={"monospace"} gutterBottom>
        {totalContributions} contributions in last 365 days
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: "1px",
          width: "100%",
          height: "100%",
          overflow: "auto",
        }}
      >
        {renderContributionChart}
      </Box>
    </Box>
  );
};

export default ContributionChart;
