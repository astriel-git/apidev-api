// src/modules/Users/routes/userRoutes.ts
import * as express from 'express';
import * as userController from '../controllers/userControllers.ts';
import * as userSchemas from '../validation/userSchemas.ts';
import * as UserInterface from '../types/userTypes.ts';
import { validateRequest } from '../../../core/middlewares/validateRequest.ts';
// import { authenticateToken } from '../../../core/middlewares/authMiddleware.ts';

const router = express.Router();

router.post('/login', validateRequest<UserInterface.LoginRequest>(userSchemas.loginSchema, 'body'), userController.loginUser);
router.post('/register', validateRequest<UserInterface.RegisterRequest>(userSchemas.registerUserSchema, 'body'), userController.registerUser);
router.post('/recuperar', validateRequest<UserInterface.RecoverPasswordRequest>(userSchemas.recoverPasswordSchema, 'body'), userController.recoverPassword);
router.post('/reset', validateRequest<UserInterface.ResetPasswordRequest>(userSchemas.resetPasswordSchema, 'body'), userController.resetPassword);

router.get('/validate-reset', validateRequest<UserInterface.ValidatePasswordResetRequest>(userSchemas.validateResetSchema, 'query'), userController.validateReset);

export default router;
