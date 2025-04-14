import { Router } from 'express';
import userRoutes from '../modules/Users/routes/userRoutes.ts';
import pacoteRoutes from '../modules/Pacotes/routes/pacoteRoutes.ts';
import saldoRoutes from '../modules/Saldos/routes/saldoRoutes.ts';
import libRoutes from '../modules/Utilities/routes/index.ts';

const router = Router();

// Define all routes under a consistent namespace
router.use('/users', userRoutes);
router.use('/pacotes', pacoteRoutes);
router.use('/saldos', saldoRoutes);
router.use('/library', libRoutes);

export default router;
