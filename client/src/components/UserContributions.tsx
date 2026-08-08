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
 * Black or white, whichever is readable on this cell's colour.
 *
 * The count used to be painted `#fffff0` on every cell — near-white on a scale
 * whose lightest step is `#ebedf0`, so a zero-contribution day was white on
 * white and the lightest third of the ramp was unreadable. No single colour
 * works across the whole ramp, which is why the digits were dropped once; this
 * picks per cell instead, using the same WCAG relative-luminance formula the
 * contrast audit used. `#ebedf0` gets black (14.5:1), `#216e39` gets white
 * (7.5:1).
 */
const readableOn = (color: string): string => {
  const hex = /^#?([0-9a-f]{6})$/i.exec(color);
  if (!hex) return "#23272b"; // the padding cells' "grey", and any surprise
  const value = parseInt(hex[1], 16);
  const channels = [(value >> 16) & 255, (value >> 8) & 255, value & 255].map(
    (v) => {
      const c = v / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    }
  );
  const luminance =
    0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
  const onBlack = (luminance + 0.05) / 0.05;
  const onWhite = 1.05 / (luminance + 0.05);
  return onBlack > onWhite ? "#000000" : "#ffffff";
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
            const count = day.contributionCount ?? 0;
            return (
              // The count is in the cell, in the tooltip and in the accessible
              // name. Three digits do not fit a 20px cell at the same size one
              // does, so the type shrinks rather than overflowing.
              <Tooltip key={index} title={label} enterTouchDelay={0} arrow>
                <Box
                  role="gridcell"
                  aria-label={label}
                  sx={{
                    backgroundColor: day.color,
                    color: readableOn(day.color),
                    width: "20px",
                    height: "20px",
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    lineHeight: 1,
                    fontSize: count > 99 ? "0.5rem" : "0.65rem",
                  }}
                >
                  {count}
                </Box>
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
