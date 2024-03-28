import express from 'express';
import { articleController } from '../controllers/article.controller';
import { validateData } from '../middlewares/data-validator.middleware';
import { articleCreateSchema } from '../models/Article';
import { verifyToken } from '../middlewares/auth.middleware';

const router = express.Router();

router
  .route('/')
  .post(
    verifyToken,
    validateData(articleCreateSchema),
    articleController.createArticle,
  )
  .get(articleController.getArticles);

router
  .route('/:id')
  .get(articleController.getSingleArticle)
  .patch(verifyToken, articleController.updateArticle)
  .delete(verifyToken, articleController.deleteArticle);

export default router;
