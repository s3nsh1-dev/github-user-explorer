import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";

const LoadingSkeleton = () => {
  return (
    <Box>
      <Typography fontFamily="monospace" gutterBottom>
        Loading contributions...
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
        {/* 52 weeks for a year */}
        {Array.from({ length: 52 }).map((_, weekIndex) => (
          <Box
            key={weekIndex}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "1px",
            }}
          >
            {/* 7 days per week */}
            {Array.from({ length: 7 }).map((_, dayIndex) => (
              <Skeleton
                key={dayIndex}
                variant="rounded"
                width={20}
                height={20}
                sx={{ borderRadius: "10px", flexShrink: 0 }}
              />
            ))}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default LoadingSkeleton;
