import articlesService from "@/services/articles.service";
import {
  CreateArticleDto,
  DeleteArticleDto,
  GetArticlesDto,
  GetSingleArticlesDto,
  UpdateArticleDto,
} from "@/types";
import { useMutation, useQuery } from "react-query";

const useArticles = ({
  currentPage,
  isSorted,
  text,
  initialData,
}: GetArticlesDto) => {
  return useQuery(
    ["articles", currentPage, isSorted, text],
    () => articlesService.getAllArticles(currentPage, isSorted, text),
    {
      initialData,
      keepPreviousData: true,
      onSuccess: () => {
        window.scrollTo(0, 0);
      },
    }
  );
};

const useUpdateArticle = () => {
  return useMutation(
    ({ values, _id }: UpdateArticleDto) =>
      articlesService.updateArticle(values, _id),
    {
      onSuccess: ({ data }, { onSuccess }) => {
        onSuccess({
          title: data.article.title,
          link: data.article.link,
          pubDate: data.article.pubDate,
        });
      },
    }
  );
};

const useDeleteArticle = () => {
  return useMutation(({ _id, onSuccess }: DeleteArticleDto) =>
    articlesService.deleteArticle(_id).then(() => onSuccess())
  );
};

const useCreateArticle = () => {
  return useMutation(
    async ({ values }: CreateArticleDto) =>
      await articlesService.createArticle(values),
    {
      onSuccess: (data, { onSuccess }) => {
        onSuccess(data.data.article._id);
      },
      onError: (error: any, { onError }) => {
        console.log(error);
        onError(error.response.data.details);
      },
    }
  );
};

const useSingleArticle = ({ _id }: GetSingleArticlesDto) => {
  return useQuery(
    ["article", _id],
    async () => await articlesService.getSingleArticle(_id),
    {
      select: (data) => data.data,
      enabled: !!_id,
      cacheTime: 0,
    }
  );
};

export {
  useArticles,
  useUpdateArticle,
  useDeleteArticle,
  useSingleArticle,
  useCreateArticle,
};
