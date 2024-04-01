import { PaletteMode } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import { useLogout } from "@/hooks/useAuth";
import { useState } from "react";
import Menu from "../Menu/Menu";
import Logo from "../Logo/Logo";
import ActionsMdPanel from "../ActionsPanel/md/ActionsMdPanel";
import ActionsSmPanel from "../ActionsPanel/sm/ActionsSmPanel";

interface AppAppBarProps {
  mode: PaletteMode;
  toggleColorMode: () => void;
}

function AppAppBar({ mode, toggleColorMode }: AppAppBarProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const { logout } = useAuth();
  const { isLoading, mutate } = useLogout();

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const handleLogout = async () => {
    const onSuccess = () => {
      logout();
      router.push("/");
    };
    mutate({ onSuccess });
  };

  return (
    <div>
      <AppBar
        position="fixed"
        sx={{
          boxShadow: 0,
          bgcolor: "transparent",
          backgroundImage: "none",
          mt: 2,
        }}
      >
        <Container maxWidth="lg">
          <Toolbar variant="regular">
            <Logo />
            <ActionsMdPanel
              mode={mode}
              toggleColorMode={toggleColorMode}
              handleLogout={handleLogout}
              isLoading={isLoading}
            />
            <ActionsSmPanel toggleDrawer={toggleDrawer} />
          </Toolbar>
          <Menu
            mode={mode}
            toggleColorMode={toggleColorMode}
            handleLogout={handleLogout}
            isLoading={isLoading}
            open={open}
            toggleDrawer={toggleDrawer}
          />
        </Container>
      </AppBar>
    </div>
  );
}

export default AppAppBar;
