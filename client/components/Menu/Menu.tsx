import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Drawer,
  Typography,
} from "@mui/material";
import { useState } from "react";
import ToggleColorMode from "../ToggleColorMode/ToggleColorMode";
import { useAuth } from "@/context/AuthContext";
import { ToolbarProps } from "@/types";

const Menu = ({
  mode,
  toggleColorMode,
  handleLogout,
  isLoading,
  open,
  toggleDrawer,
}: ToolbarProps) => {
  const { username, isAuth } = useAuth();

  return (
    <Drawer anchor="right" open={open} onClose={() => toggleDrawer(false)}>
      <Box
        sx={{
          minWidth: "30dvw",
          p: 2,
          backgroundColor: "background.paper",
          flexGrow: 1,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "end",
            flexGrow: 1,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
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
            <Divider />
            <ToggleColorMode mode={mode} toggleColorMode={toggleColorMode} />
          </Box>
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
      </Box>
    </Drawer>
  );
};

export default Menu;
