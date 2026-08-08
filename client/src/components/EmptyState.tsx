import { Box, Typography } from "@mui/material";
import type { ReactNode } from "react";

/**
 * "There is nothing here" is not an error, and it should not look like one.
 *
 * `<ErrorState>` is for a request that failed; this is for a request that
 * succeeded and found nothing, or for a screen that has not been given
 * anything to do yet. Keeping them apart is why a zero-result search no
 * longer congratulates the visitor and an empty `/explore` no longer searches
 * GitHub for a literal placeholder. report/suggestions/10.
 */
type Props = {
  icon?: ReactNode;
  title: string;
  message?: string;
  action?: ReactNode;
};

const EmptyState = ({ icon, title, message, action }: Props) => (
  <Box
    sx={{
      minHeight: "50vh",
      display: "grid",
      placeItems: "center",
      alignContent: "center",
      textAlign: "center",
      gap: 1.5,
      p: 3,
    }}
  >
    {icon && <Box sx={{ color: "text.disabled", display: "flex" }}>{icon}</Box>}
    <Typography fontFamily="monospace" fontSize={{ xs: 20, sm: 24 }}>
      {title}
    </Typography>
    {message && (
      <Typography color="text.secondary" sx={{ maxWidth: 460 }}>
        {message}
      </Typography>
    )}
    {action}
  </Box>
);

export default EmptyState;
