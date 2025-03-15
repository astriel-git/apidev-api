// src/modules/Users/routes/userRoutes.ts
import * as express from 'express';
import * as userController from '../controllers/userControllers.ts';

const router = express.Router();

router.post('/login', userController.loginUser);
router.post('/register', userController.registerUser);
router.post('/recuperar', userController.recoverPassword);
router.post('/reset', userController.resetPassword);
router.get('/validate-reset', userController.validateReset);

export default router;
