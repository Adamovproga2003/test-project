import { useState } from "react";
import { Alert, Container } from "@mui/material";
import Box from "@mui/material/Box";
import AppAppBar from "./../components/AppAppBar/AppAppBar";
import { GetServerSideProps } from "next";
import { Article } from "@/types";
import { useArticles } from "@/hooks/useArticles";
import articlesService from "@/services/articles.service";
import ControlPanel from "@/components/ControlPanel/ControlPanel";
import TransitionList from "@/components/TransitionList/TransitionList";

interface IHome {
  mode: "light" | "dark";
  toggleColorMode: () => void;
  articles: Article[];
  totalPages: number;
  msg: string;
  error?: string;
}

export default function Home({
  mode,
  toggleColorMode,
  articles,
  totalPages,
  msg,
  error,
}: IHome) {
  const [currentPage, setCurrentPage] = useState(1);
  const [isSorted, setSorted] = useState(false);
  const [text, setText] = useState("");

  const { data, isLoading } = useArticles({
    currentPage,
    isSorted,
    text,
    initialData: { articles, totalPages, msg, error },
  });

  return (
    <>
      <AppAppBar mode={mode} toggleColorMode={toggleColorMode} />
      <Box sx={{ bgcolor: "background.default" }}>
        <Container sx={{ marginTop: "100px" }}>
          {error && (
            <Alert variant="filled" severity="error">
              {error}
            </Alert>
          )}
          {!error && data && (
            <>
              <ControlPanel
                isSorted={isSorted}
                text={text}
                setSorted={setSorted}
                setText={setText}
                mode={mode}
              />
              <TransitionList
                isLoading={isLoading}
                data={data}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
              />
            </>
          )}
        </Container>
      </Box>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const data = await articlesService.getAllArticles();
    return {
      props: {
        articles: data?.articles ?? [],
        totalPages: data?.totalPages ?? 0,
        msg: data?.msg ?? "",
      },
    };
  } catch (error: any) {
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return {
      props: {
        articles: [],
        totalPages: 0,
        msg: "",
        error: errorMessage,
      },
    };
  }
};
