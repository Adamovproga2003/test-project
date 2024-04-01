import express from 'express';
import { userController } from '../controllers/auth.controller';
import { validateData } from '../middlewares/data-validator.middleware';
import { userAuthSchema } from '../models/User';
import { verifyToken } from '../middlewares/auth.middleware';

const router = express.Router();

router
  .route('/register')
  .post(verifyToken, validateData(userAuthSchema), userController.register);

router.route('/login').post(validateData(userAuthSchema), userController.login);
router.route('/me').get(verifyToken, userController.me);
router.route('/logout').post(verifyToken, userController.logout);

export default router;
