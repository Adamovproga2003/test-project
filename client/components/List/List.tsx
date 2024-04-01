import List from "@mui/material/List";
import { Alert, Box, ListItem } from "@mui/material";
import { Article } from "@/types";
import Item from "./Item/Item";
import { useDeleteArticle } from "@/hooks/useArticles";
import OverlayLoader from "../OverlayLoader/OverlayLoader";

type FolderList = {
  data: Article[];
};

export default function FolderList({ data }: FolderList) {
  const { isLoading, mutate } = useDeleteArticle();

  return (
    <Box sx={{ position: "relative" }}>
      {isLoading && <OverlayLoader />}
      <List
        sx={{
          width: "100%",
          bgcolor: "background.paper",
          borderRadius: "8px",
          maxWidth: "100%",
          marginBottom: "15px",
        }}
      >
        {data.length > 0 &&
          data.map((item, index) => (
            <Item key={"item" + index} item={item} mutate={mutate} />
          ))}

        {data.length == 0 && (
          <ListItem>
            <Alert variant="filled" severity="info" sx={{ width: "100%" }}>
              There is no items...
            </Alert>
          </ListItem>
        )}
      </List>
    </Box>
  );
}
