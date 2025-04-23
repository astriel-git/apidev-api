// src/modules/Users/routes/userRoutes.ts
import * as express from 'express';
import * as utilController from '../controllers/utilsControllers.ts';
import * as utilsSchemas from '../validation/utilsSchemas.ts';
import * as UtilInterface from '../types/utilsTypes.ts';
import { validateRequest } from '../../../core/middlewares/validateRequest.ts';

const router = express.Router();

router.get('/dates', utilController.fetchDates);
router.post('/categories', validateRequest<UtilInterface.ParseCategoriesRequest>(utilsSchemas.validateCategorySchema, 'body'), utilController.parseCategories);
router.post('/download', validateRequest<UtilInterface.DownloadRequest>(utilsSchemas.validateDownloadSchema, 'body'), utilController.downloadCategoriesFiles);
router.post('/unzip', validateRequest<UtilInterface.UnzipRequest>(utilsSchemas.validateUnzipSchema, 'body'), utilController.unzipFiles);


router.post(
  '/import',
  validateRequest<UtilInterface.ImportFilesRequest>(
    utilsSchemas.validateImportSchema,
    'body'
  ),
  utilController.importFiles
);
export default router;


