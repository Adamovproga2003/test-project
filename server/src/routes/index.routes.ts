import express from 'express';
import articleRouter from './article.routes';
import authRouter from './auth.routes';

const router = express.Router();

router.use('/articles', articleRouter);
router.use('/auth', authRouter);
export default router;
