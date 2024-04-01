import { ARTICLES_CONSTANTS } from "@/constants/articles.contants";
import {
  Article,
  ResponseDeleteArticleDto,
  ResponseEditArticleDto,
  ResponseGetArticlesDto,
  ResponseGetSingleArticleDto,
} from "@/types";
import axios, { AxiosInstance } from "axios";

const { BASE } = ARTICLES_CONSTANTS;

class ArticlesService {
  public readonly instance: AxiosInstance;
  public constructor(url: string) {
    this.instance = axios.create({
      baseURL: url,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async getAllArticles(
    currentPage?: number,
    isSorted?: boolean,
    text?: string
  ) {
    let queryUrl = "?";

    if (currentPage) queryUrl += "page=" + currentPage + "&";
    if (isSorted) queryUrl += "sort=" + (isSorted ? 1 : -1) + "&";
    if (text) queryUrl += "filter=" + text;

    return this.instance
      .get<ResponseGetArticlesDto>(`/${queryUrl}`)
      .then((response) => response.data)
      .catch((error) => {
        throw new Error(error.response.data.error);
      });
  }

  async updateArticle(fields: Partial<Article>, _id: string) {
    return this.instance.patch<ResponseEditArticleDto>(`/${_id}`, {
      ...fields,
    });
  }

  async deleteArticle(_id: string) {
    return this.instance.delete<ResponseDeleteArticleDto>(`/${_id}`);
  }

  async getSingleArticle(_id: string | string[] | undefined) {
    return this.instance.get<ResponseGetSingleArticleDto>(`/${_id}`);
  }

  async createArticle(fields: Partial<Article>) {
    return this.instance.post<ResponseEditArticleDto>(`/`, {
      ...fields,
    });
  }
}

const articlesService = new ArticlesService(
  process.env.NEXT_PUBLIC_API_URL + BASE || ""
);
export default articlesService;
