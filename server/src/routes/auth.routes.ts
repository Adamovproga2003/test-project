import express from 'express';
import { userController } from '../controllers/auth.controller';
import { validateData } from '../middlewares/data-validator.middleware';
import { userAuthSchema } from '../models/User';

const router = express.Router();

router
  .route('/register')
  .post(validateData(userAuthSchema), userController.register);

router.route('/login').post(validateData(userAuthSchema), userController.login);

export default router;
