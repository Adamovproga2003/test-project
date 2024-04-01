import { AnimatePresence, motion } from "framer-motion";
import FolderList from "../List/List";
import Paginator from "../Pagination/Pagination";
import { Box, CircularProgress } from "@mui/material";
import { ResponseGetArticlesDto } from "@/types";
import { Dispatch, SetStateAction } from "react";

type Props = {
  isLoading: boolean;
  data: ResponseGetArticlesDto;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
};

const TransitionList = ({
  isLoading,
  data,
  currentPage,
  setCurrentPage,
}: Props) => {
  return (
    <AnimatePresence mode="wait">
      {!isLoading ? (
        <motion.div
          key={isLoading + "list"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <FolderList data={data.articles} />
          {data.totalPages > 1 && (
            <Paginator
              totalCount={data?.totalPages}
              page={currentPage}
              callback={setCurrentPage}
            />
          )}
        </motion.div>
      ) : (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <CircularProgress />
        </Box>
      )}
    </AnimatePresence>
  );
};

export default TransitionList;
