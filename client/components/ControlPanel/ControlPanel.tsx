import { Box, IconButton, InputAdornment, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import AddIcon from "@mui/icons-material/Add";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import { Dispatch, SetStateAction } from "react";

type Props = {
  isSorted: boolean;
  text: string;
  setSorted: Dispatch<SetStateAction<boolean>>;
  setText: Dispatch<SetStateAction<string>>;
  mode: "light" | "dark";
};

const ControlPanel = ({ isSorted, text, setSorted, setText, mode }: Props) => {
  const router = useRouter();
  const { isAuth } = useAuth();
  return (
    <Box
      sx={{
        display: "flex",
        gap: "10px",
        alignItems: "center",
        marginBottom: "10px",
      }}
    >
      <TextField
        id="outlined-basic"
        placeholder="Keywords..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        value={text}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setText(event.target.value);
        }}
      />
      <IconButton
        aria-label="sort list of articles"
        onClick={() => setSorted((prev) => !prev)}
        sx={{
          bgcolor: isSorted
            ? mode === "light"
              ? "rgba(0, 0, 0, 0.04)"
              : "rgba(255, 255, 255, 0.08)"
            : "transparent",
          flexShrink: 0,
        }}
      >
        <SwapVertIcon />
      </IconButton>
      {isAuth && (
        <IconButton
          aria-label="add article"
          onClick={() => router.push("/create")}
          sx={{
            bgcolor: isSorted
              ? mode === "light"
                ? "rgba(0, 0, 0, 0.04)"
                : "rgba(255, 255, 255, 0.08)"
              : "transparent",
            flexShrink: 0,
          }}
        >
          <AddIcon />
        </IconButton>
      )}
    </Box>
  );
};

export default ControlPanel;
