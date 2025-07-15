import LoadingSkeleton from "./LoadingSkeleton";
import type { FC } from "react";
import { Box, Typography } from "@mui/material";

type Week = {
  contributionDays: ContributionDay[];
};

type ContributionDay = {
  date: string; // or ""
  contributionCount: number | null;
  color: string; // hex color or "grey"
};

type dataTypes = {
  data: {
    user: {
      contributionsCollection: {
        contributionCalendar: {
          totalContributions: number | null;
          weeks: Week[];
        };
      };
    };
  };
};

type UserContributionsProps = {
  data: dataTypes;
  isLoading: boolean;
  error: unknown;
};

const UserContributions: FC<UserContributionsProps> = ({
  data,
  isLoading,
  error,
}) => {
  if (isLoading) return <LoadingSkeleton />;
  if (error) return <div>no data</div>;
  if (!data) return null;
  const totalContributions: number | null =
    data.data.user.contributionsCollection.contributionCalendar
      .totalContributions;
  const weeks: Week[] =
    data.data.user.contributionsCollection.contributionCalendar.weeks;

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
