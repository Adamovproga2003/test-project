import { useEffect, useState } from "react";
import {
  Alert,
  CircularProgress,
  Container,
  IconButton,
  InputAdornment,
  PaletteMode,
  TextField,
} from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import AppAppBar from "./../components/AppAppBar/AppAppBar";
import getLPTheme from "./../theme";
import FolderList from "@/components/List/List";
import { GetServerSideProps } from "next";
import axios, { AxiosError } from "axios";
import Paginator from "@/components/Pagination/Pagination";
import SearchIcon from "@mui/icons-material/Search";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import { useQuery } from "react-query";
import { Article, ResponseGetArticlesDto } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { AnimatePresence, motion } from "framer-motion";

interface IHome {
  articles: Article[];
  totalPages: number;
  token: string | null;
}

type ResponseMeDto = {
  msg: string;
  user: {
    _id: number;
    username: string;
  };
};

export default function Home({ articles, totalPages }: IHome) {
  const [mode, setMode] = useState<PaletteMode>("light");
  const LPtheme = createTheme(getLPTheme(mode));
  const [dataArticles, setDataArticles] = useState(articles);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(totalPages);
  const [isSorted, setSorted] = useState(false);
  const [text, setText] = useState("");

  const toggleColorMode = () => {
    setMode((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const { isLoading, isError } = useQuery(
    ["articles", currentPage, isSorted, text],
    async () => {
      const response = await axios.get<ResponseGetArticlesDto>(
        `${
          process.env.NEXT_PUBLIC_API_URL
        }/articles/?page=${currentPage}&sort=${
          isSorted ? 1 : -1
        }&filter=${text}`
      );
      return response.data;
    },
    {
      keepPreviousData: true,
      onSuccess: (data) => {
        window.scrollTo(0, 0);
        setDataArticles(data.articles);
        setTotalCount(data.totalPages);
      },
    }
  );

  return (
    <ThemeProvider theme={LPtheme}>
      <CssBaseline />
      <AppAppBar mode={mode} toggleColorMode={toggleColorMode} />
      <Box sx={{ bgcolor: "background.default" }}>
        <Container sx={{ marginTop: "100px" }}>
          {isError && (
            <Alert variant="filled" severity="error">
              There is no items...
            </Alert>
          )}
          {!isError && (
            <>
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
                  aria-label="add to shopping cart"
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
              </Box>
              <AnimatePresence mode="wait">
                {!isLoading && (
                  <motion.div
                    key={currentPage + "modal"}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <FolderList data={dataArticles} />
                  </motion.div>
                )}
              </AnimatePresence>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                {isLoading && <CircularProgress />}
              </Box>
              {!isLoading && totalCount > 1 && (
                <Paginator
                  totalCount={totalCount}
                  page={currentPage}
                  callback={setCurrentPage}
                />
              )}
            </>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export const getServerSideProps = (async ({ req, res }) => {
  const data = await axios
    .get<ResponseGetArticlesDto>(`${process.env.NEXT_PUBLIC_API_URL}/articles/`)
    .then((response) => {
      return response.data;
    })
    .catch((err: AxiosError) => {
      console.log(err);
      console.error(err.message);
      return null;
    });

  if (data) {
    return {
      props: {
        articles: data.articles,
        totalPages: data.totalPages,
      },
    };
  }
  return { props: { articles: [], totalPages: 0 } };
}) satisfies GetServerSideProps<{ articles: Article[]; totalPages: number }>;
