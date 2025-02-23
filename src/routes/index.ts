import { Router } from 'express';
import userRoutes from '../modules/Users/routes/userRoutes.ts';
import aRoutes from '../modules/PacoteA/routes/aRoutes.ts';
import bRoutes from '../modules/PacoteB/routes/bRoutes.ts';
import cRoutes from '../modules/PacoteC/routes/cRoutes.ts';
import dRoutes from '../modules/PacoteD/routes/dRoutes.ts';
import libRoutes from '../modules/Utilities/routes/index.ts';

const router = Router();

// Define all routes under a consistent namespace
router.use('/users', userRoutes);
router.use('/pacote-a', aRoutes);
router.use('/pacote-b', bRoutes);
router.use('/pacote-c', cRoutes);
router.use('/pacote-d', dRoutes);
router.use('/library', libRoutes);

export default router;
