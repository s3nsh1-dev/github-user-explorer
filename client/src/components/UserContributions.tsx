import LoadingSkeleton from "./LoadingSkeleton";
import { Box, Typography } from "@mui/material";
import useFetchContributionInfo from "../hooks/useFetchContributionInfo";
import type { FC } from "react";
// Week / ContributionDay used to be declared here *and* structurally inside the
// response type. One definition now, derived from the schema that validates it.
import type { Week } from "../constants/common.types";
import ErrorState from "./ErrorState";

type PropType = {
  username: string;
};

const UserContributions: FC<PropType> = ({ username }) => {
  const { data, isLoading, error, refetch } =
    useFetchContributionInfo(username);

  if (isLoading) return <LoadingSkeleton />;
  if (error) return <ErrorState error={error} onRetry={refetch} sx={{ mt: 2 }} />;
  // `user` is null when GitHub cannot resolve the login. githubGraphQL turns
  // that into a NotFoundError in practice, but the field is nullable on the
  // wire, so the compiler is right to insist it be handled.
  if (!data?.user) return null;
  const totalContributions: number =
    data.user.contributionsCollection.contributionCalendar.totalContributions;
  const weeks: Week[] =
    data.user.contributionsCollection.contributionCalendar.weeks;

  const renderContributionChart: React.ReactNode[] = weeks.map(
    (week: Week, index: number) => {
      const passingArray = week.contributionDays;
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
          {finalPass.map((day, index) => {
            return (
              <Box
                key={index}
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

export default UserContributions;
