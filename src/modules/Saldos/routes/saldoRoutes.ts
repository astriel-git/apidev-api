// src/modules/Users/routes/userRoutes.ts
import * as express from 'express';
import * as saldoController from '../controllers/saldoControllers.ts';
// import { data } from 'cheerio/dist/commonjs/api/attributes';
// import { authenticateToken } from '../../../core/middlewares/authMiddleware.ts';
import * as SaldosInterface from '../types/saldoTypes.ts';
import * as saldoSchemas from '../validation/saldoSchemas.ts';
import { validateRequest } from '../../../core/middlewares/validateRequest.ts';


const router = express.Router();
router.post('/user-saldos',validateRequest<SaldosInterface.UserSaldoRequest>(saldoSchemas.userSaldoSchema, 'body'), saldoController.userSaldos);

export default router;
