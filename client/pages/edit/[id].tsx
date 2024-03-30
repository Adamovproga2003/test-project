import AppAppBar from "@/components/AppAppBar/AppAppBar";
import FormArticle from "@/components/FormArticle/FormArticle";
import getLPTheme from "@/theme";
import { Article } from "@/types";
import {
  Alert,
  Box,
  CircularProgress,
  Container,
  CssBaseline,
  InputAdornment,
  PaletteMode,
  TextField,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useQuery } from "react-query";

type Props = {};

type ResponseGetArticleDto = {
  article: Article;
  msg: string;
};

export default function EditPage(props: Props) {
  const [mode, setMode] = useState<PaletteMode>("light");
  const LPtheme = createTheme(getLPTheme(mode));
  const [error, setError] = useState<string | null>(null);

  const toggleColorMode = () => {
    setMode((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const router = useRouter();
  const articleID = router.query.id;

  const { data, isLoading, isError } = useQuery(
    ["article", articleID],
    async () => {
      const response = await axios.get<ResponseGetArticleDto>(
        `${process.env.NEXT_PUBLIC_API_URL}/articles/${articleID}`
      );
      return response.data;
    },
    {
      enabled: !!articleID,
      onError: (err) => {
        console.error(err);
        setError("Something went wrong");
      },
    }
  );

  return (
    <ThemeProvider theme={LPtheme}>
      <CssBaseline />
      <AppAppBar mode={mode} toggleColorMode={toggleColorMode} />
      <Box sx={{ bgcolor: "background.default" }}>
        <Container sx={{ marginTop: "100px" }}>
          <AnimatePresence mode="wait">
            {!isLoading && data && data.article && (
              <motion.div
                key={"article" + articleID}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <FormArticle initialValues={data.article} />
              </motion.div>
            )}
            {isError && (
              <Alert variant="filled" severity="error">
                {error}
              </Alert>
            )}
            {isLoading && (
              <motion.div
                key={"loader" + articleID}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <CircularProgress />
              </motion.div>
            )}
          </AnimatePresence>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
