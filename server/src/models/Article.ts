import { Schema, model } from 'mongoose';
import { object, string } from 'zod';

export interface IArticle {
  title: string;
  link: string;
  pubDate: Date;
}

export const ArticleSchema = new Schema<IArticle>(
  {
    title: {
      type: String,
      required: [true, 'Title should not be empty!'],
      index: true,
    },
    link: {
      type: String,
      required: [true, 'Link should not be empty!'],
    },
    pubDate: {
      type: Date,
      default: new Date(),
    },
  },
  { timestamps: true },
);

ArticleSchema.index({ title: 'text' });

export const articleCreateSchema = object({
  body: object({
    title: string({
      required_error: 'title is required',
    }),
    link: string({
      required_error: 'link is required',
    }).url(),
  }),
});

export const Article = model<IArticle>('Article', ArticleSchema);
Article.createIndexes();
