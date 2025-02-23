// src/apps/LibRoutes/entry-points/api/index.js
import { Router } from 'express';
import downloaderRoutes from './downloaderRoutes.ts';
import importerRoutes from './importerRoutes.ts';
import unzipperRoutes from './unzipperRoutes.ts';
import getAvailableDates from './getAvailableDates.ts';
import getAvailableCategories from './getAvailableCategories.ts';

const router = Router();

router.use('/download', downloaderRoutes);
router.use('/import', importerRoutes);
router.use('/unzip', unzipperRoutes);
router.use('/dates', getAvailableDates);
router.use('/categories', getAvailableCategories);

export default router;
