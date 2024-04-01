import { Box, Button } from "@mui/material";
import React from "react";
import MenuIcon from "@mui/icons-material/Menu";

type Props = {
  toggleDrawer: (newOpen: boolean) => void;
};

const ActionsSmPanel = ({ toggleDrawer }: Props) => {
  return (
    <Box sx={{ display: { sm: "", md: "none" } }}>
      <Button
        variant="text"
        color="primary"
        aria-label="menu"
        onClick={() => toggleDrawer(true)}
        sx={{ minWidth: "30px", p: "4px" }}
      >
        <MenuIcon />
      </Button>
    </Box>
  );
};

export default ActionsSmPanel;
