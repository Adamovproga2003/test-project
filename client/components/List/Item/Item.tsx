import { useAuth } from "@/context/AuthContext";
import {
  Avatar,
  Button,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import React, { MouseEvent, useState } from "react";
import LinkIcon from "@mui/icons-material/Link";
import dateFormat from "dateformat";
import { useRouter } from "next/router";
import EditIcon from "@mui/icons-material/Edit";
import { Article } from "@/types";
import DeleteIcon from "@mui/icons-material/Delete";
import styles from "./Item.module.scss";
import { useQueryClient } from "react-query";
import axios from "axios";

type Props = {
  item: Article;
};

const Item = ({ item }: Props) => {
  const router = useRouter();
  const { isAuth } = useAuth();
  const [isHoverEdit, setHoverEdit] = useState(false);
  const queryClient = useQueryClient();

  const handleDelete = async (e: MouseEvent<HTMLButtonElement>, id: string) => {
    e.stopPropagation();
    await axios
      .delete(`${process.env.NEXT_PUBLIC_API_URL}/articles/${id}`)
      .then(() => queryClient.invalidateQueries(["articles"]))
      .catch((error) => console.error(error));
  };

  const handleEdit = (e: MouseEvent<HTMLButtonElement>, id: string) => {
    e.stopPropagation();
    router.push(`/edit/${id}`);
  };

  return (
    <ListItem
      onClick={() => router.push(item.link)}
      style={{ cursor: "pointer" }}
      onMouseEnter={() => setHoverEdit(true)}
      onMouseLeave={() => setHoverEdit(false)}
    >
      <ListItemAvatar>
        <Avatar>
          {isHoverEdit && isAuth ? (
            <Button
              type="button"
              sx={{
                color: "#fff",
              }}
              className={styles.deleteButton}
              onClick={(e) => handleDelete(e, item._id)}
            >
              <DeleteIcon />
            </Button>
          ) : (
            <LinkIcon />
          )}
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={item.title}
        secondary={dateFormat(new Date(item.pubDate), "mmm d, yyyy")}
      />
      {isHoverEdit && isAuth && (
        <Button type="button" onClick={(e) => handleEdit(e, item._id)}>
          <EditIcon />
        </Button>
      )}
    </ListItem>
  );
};

export default Item;
