// src/apps/LibRoutes/entry-points/api/index.js
import * as express from 'express';
import importerRoutes from './importerRoutes.ts';

const router = express.Router();

router.post('/import', importerRoutes);

export default router;
