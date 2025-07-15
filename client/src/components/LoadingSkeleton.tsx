import Box from "@mui/material/Box";
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
              <Box
                key={dayIndex}
                sx={{
                  backgroundColor: "#e0e0e0", // grey placeholder
                  width: "20px",
                  height: "20px",
                  borderRadius: "10px",
                  animation: "pulse 1.5s infinite",
                }}
              />
            ))}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default LoadingSkeleton;
