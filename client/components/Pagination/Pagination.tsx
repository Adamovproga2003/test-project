import { Pagination } from "@mui/material";
import React, { Dispatch, SetStateAction } from "react";

type Props = {
  totalCount: number;
  page: number;
  callback: Dispatch<SetStateAction<number>>;
};

const Paginator = ({ totalCount, page, callback }: Props) => {
  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    callback(value);
  };

  return (
    <Pagination
      sx={{ display: "flex", justifyContent: "center", marginBottom: "15px" }}
      variant="outlined"
      shape="rounded"
      count={totalCount}
      page={page}
      onChange={handleChange}
    />
  );
};

export default Paginator;
