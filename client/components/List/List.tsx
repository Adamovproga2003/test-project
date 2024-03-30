import List from "@mui/material/List";
import { Alert } from "@mui/material";
import { Article } from "@/types";
import Item from "./Item/Item";

type FolderList = {
  data: Article[];
};

export default function FolderList({ data }: FolderList) {
  return (
    <List
      sx={{
        width: "100%",
        bgcolor: "background.paper",
        borderRadius: "8px",
        maxWidth: "100%",
        marginBottom: "15px",
      }}
    >
      {data && data.length > 0 ? (
        data.map((item, index) => <Item key={"item" + index} item={item} />)
      ) : (
        <Alert variant="filled" severity="info">
          There is no items...
        </Alert>
      )}
    </List>
  );
}
