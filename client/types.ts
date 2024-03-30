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
