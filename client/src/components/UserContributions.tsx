import LoadingSkeleton from "./LoadingSkeleton";
import { Box, Tooltip, Typography } from "@mui/material";
import useFetchContributionInfo from "../hooks/useFetchContributionInfo";
import type { FC } from "react";
// Week / ContributionDay used to be declared here *and* structurally inside the
// response type. One definition now, derived from the schema that validates it.
import type { Week } from "../constants/common.types";
import ErrorState from "./ErrorState";

type PropType = {
  username: string;
};

/**
 * Reads a cell the way a person would say it out loud. Used for both the
 * tooltip and the accessible name, so the two can never disagree.
 */
const describeDay = (date: string, count: number | null) =>
  `${count ?? 0} contribution${count === 1 ? "" : "s"} on ${new Date(
    date
  ).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  })}`;

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

  // The substance of 365 cells in one sentence, for anyone who is not going
  // to navigate a grid cell by cell.
  const realDays = weeks.flatMap((week) => week.contributionDays);
  const best = realDays.reduce(
    (top, day) =>
      (day.contributionCount ?? 0) > (top?.contributionCount ?? 0) ? day : top,
    realDays[0]
  );
  const first = realDays[0]?.date;
  const last = realDays[realDays.length - 1]?.date;
  const summary =
    first && last
      ? `${totalContributions} contributions between ${first} and ${last}. ` +
        (best?.date ? `Most active day: ${describeDay(best.date, best.contributionCount)}.` : "")
      : `${totalContributions} contributions in the last year.`;

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
          role="row"
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "start",
            alignItems: "start",
            gap: "1px",
          }}
        >
          {finalPass.map((day, index) => {
            // Padding cells exist to square off a short week. They are not
            // days, and announcing them as days is worse than silence.
            if (!day.date) {
              return (
                <Box
                  key={index}
                  role="gridcell"
                  aria-hidden
                  sx={{
                    backgroundColor: day.color,
                    width: "20px",
                    height: "20px",
                    borderRadius: "10px",
                  }}
                />
              );
            }
            const label = describeDay(day.date, day.contributionCount);
            return (
              // The count used to be printed inside the cell in #fffff0 —
              // near-white on a scale whose lightest step is #ebedf0, so a
              // zero-contribution day was white on white and the lightest
              // third of the scale was unreadable. No single text colour
              // works across the whole green ramp, so the number moves to a
              // tooltip and an accessible name. That is what GitHub does,
              // and a 20px cell never fitted three digits anyway.
              <Tooltip key={index} title={label} enterTouchDelay={0} arrow>
                <Box
                  role="gridcell"
                  aria-label={label}
                  sx={{
                    backgroundColor: day.color,
                    width: "20px",
                    height: "20px",
                    borderRadius: "10px",
                  }}
                />
              </Tooltip>
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
        role="grid"
        aria-label={summary}
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
