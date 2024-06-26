import AppAppBar from "@/components/AppAppBar/AppAppBar";
import FormArticle from "@/components/FormArticle/FormArticle";
import { useSingleArticle } from "@/hooks/useArticles";
import { Alert, Box, CircularProgress, Container } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";

type Props = {
  mode: "light" | "dark";
  toggleColorMode: () => void;
};

export default function EditPage({ mode, toggleColorMode }: Props) {
  const router = useRouter();
  const articleID = router.query.id;

  const { data, isLoading, isError, error } = useSingleArticle({
    _id: articleID,
  });

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
                {errorMessage}
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
    </>
  );
}
