// src/modules/Users/routes/userRoutes.ts
import * as express from 'express';
import * as pacoteController from '../controllers/pacoteControllers.ts';
// import * as pacoteSchemas from '../validation/pacoteSchemas.ts';
// import * as PacoteInterface from '../types/pacoteTypes.ts';
// import { validateRequest } from '../../../core/middlewares/validateRequest.ts';
// import { authenticateToken } from '../../../core/middlewares/authMiddleware.ts';

const router = express.Router();
router.post('/lista', pacoteController.listPacotes);

export default router;
