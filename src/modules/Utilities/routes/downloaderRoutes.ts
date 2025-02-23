// src/apps/LibRoutes/entry-points/api/downloadRoutes.ts
import * as express from 'express';
import type { Request, Response, NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import downloader from '../../../utils/downloader/src/downloader.ts';
// import logger from '../../../../utils/logger.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const { downloadFilesForCategories } = downloader;

interface DownloadRequestBody {
  date: string;
  categories: string[];
}

router.post('/', async (
  req: Request<{}, {}, DownloadRequestBody>,
  res: Response
): Promise<void> => {
  const { date, categories } = req.body;

  if (!date || !categories || !Array.isArray(categories) || categories.length === 0) {
    res.status(400).json({ error: 'Date and a list of categories are required in the request body.' });
    return;
  }

  const baseUrl = `https://arquivos.receitafederal.gov.br/cnpj/dados_abertos_cnpj/${date}/`;
  const outputDir = path.resolve(__dirname, '../../../../libraries/downloader/downloads', 'output_files');

  try {
    await downloadFilesForCategories(baseUrl, outputDir, categories);
    res.status(200).json({ message: 'Download of selected categories completed successfully.' });
  } catch (error: any) {
    console.error(`Failed to download files for categories: ${error.message}`);
    res.status(500).json({ error: 'Failed to download files for selected categories.' });
  }
});


export default router;
