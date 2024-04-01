import { Box, Button, CircularProgress, Typography } from "@mui/material";
import React from "react";
import ToggleColorMode from "../../ToggleColorMode/ToggleColorMode";
import { useAuth } from "@/context/AuthContext";
import { ToolbarProps } from "@/types";

interface Props extends Omit<ToolbarProps, "open" | "toggleDrawer"> {}

const ActionsMdPanel = ({
  mode,
  toggleColorMode,
  handleLogout,
  isLoading,
}: Props) => {
  const { username, isAuth } = useAuth();

  return (
    <Box
      sx={{
        display: { xs: "none", md: "flex" },
        gap: 0.5,
        alignItems: "center",
      }}
    >
      {username && (
        <Typography
          variant="body1"
          component="span"
          sx={{ color: mode === "light" ? "#131B20" : "#fff" }}
        >
          Hello, {username}!
        </Typography>
      )}
      <ToggleColorMode mode={mode} toggleColorMode={toggleColorMode} />
      {isAuth && (
        <Button
          color="primary"
          variant="text"
          size="small"
          onClick={handleLogout}
          disabled={isLoading}
        >
          {isLoading ? <CircularProgress /> : "Logout"}
        </Button>
      )}
    </Box>
  );
};

export default ActionsMdPanel;
