import AppAppBar from "@/components/AppAppBar/AppAppBar";
import FormArticle from "@/components/FormArticle/FormArticle";
import { useCreateArticle } from "@/hooks/useArticles";
import { Alert, Box, CircularProgress, Container } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";

type Props = {
  mode: "light" | "dark";
  toggleColorMode: () => void;
};

export default function CreatePage({ mode, toggleColorMode }: Props) {
  const { isLoading, isError, error } = useCreateArticle();

  const errorMessage =
    isError && error instanceof Error
      ? error.message
      : "An unknown error occurred";

  return (
    <>
      <AppAppBar mode={mode} toggleColorMode={toggleColorMode} />
      <Box sx={{ bgcolor: "background.default" }}>
        <Container sx={{ marginTop: "100px" }}>
          <AnimatePresence mode="wait">
            {!error && !isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <FormArticle />
              </motion.div>
            )}
            {error && (
              <Alert variant="filled" severity="error">
                {errorMessage}
              </Alert>
            )}
            {isLoading && (
              <motion.div
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
    </>
  );
}
