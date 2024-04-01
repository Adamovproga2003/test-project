import { NextRouter } from "next/router";
import { Dispatch, SetStateAction } from "react";

export type Article = {
  _id: string;
  title: string;
  link: string;
  pubDate: string;
  createdAt: string;
  updatedAt: string;
};

export type ResponseGetArticlesDto = {
  articles: Article[];
  totalPages: number;
  msg: string;
  error?: string;
};

export type ResponseMeDto = {
  msg: string;
  user: {
    _id: number;
    username: string;
  };
};

export type ResponseLoginDto = {
  msg: string;
};

export type ResponseLogoutDto = {
  msg: string;
};

export type ResponseEditArticleDto = {
  msg: string;
  article: Article;
};

export type ResponseDeleteArticleDto = {
  msg: string;
};

export type initialValues = {
  title: string;
  link: string;
  pubDate: string;
};

export type UpdateArticleDto = {
  values: Partial<Article>;
  _id: string;
  onSuccess: (values: initialValues) => void;
};

export type DeleteArticleDto = {
  _id: string;
  onSuccess: () => void;
};

export type ResponseGetSingleArticleDto = {
  article: Article;
  msg: string;
};

export type GetArticlesDto = {
  currentPage: number;
  isSorted: boolean;
  text: string;
  initialData?: ResponseGetArticlesDto;
};

export type GetSingleArticlesDto = {
  _id: string | string[] | undefined;
};

export type LogoutDto = {
  onSuccess: () => void;
};

export type LoginDto = {
  username: string;
  password: string;
  onSuccess: (username: string) => void;
};

export type ErrorField = {
  message: string;
  field: "url" | "title";
};

export type CreateArticleDto = {
  values: Partial<Article>;
  onSuccess: (_id: string) => void;
  onError: (details: ErrorField[]) => void;
};

export type ToolbarProps = {
  mode: "light" | "dark";
  toggleColorMode: () => void;
  handleLogout: () => Promise<void>;
  isLoading: boolean;
  open: boolean;
  toggleDrawer: (newOpen: boolean) => void;
};
