import { Box, CircularProgress } from "@mui/material";

const OverlayLoader = () => {
  return (
    <Box
      sx={{
        top: "0%",
        left: "0%",
        position: "absolute",
        bgcolor: "rgba(255, 255, 255, 0.1)",
        width: "100%",
        height: "100%",
        zIndex: 1,
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
        }}
      >
        <CircularProgress />
      </Box>
    </Box>
  );
};

export default OverlayLoader;
