// src/apps/LibRoutes/entry-points/api/unzipperRoutes.ts
import * as express from 'express';
import type { Request, Response, NextFunction } from 'express';



import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import unzipFile from '../../../utils/unzipper/src/unzipper.ts';
import logger from '../../../core/utils/logger.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();

interface UnzipperRequestBody {
  fileName: string;
}

// Endpoint to unzip a specific file
router.post(
  '/',
  async (req: Request<{}, {}, UnzipperRequestBody>, res: Response): Promise<void> => {
    const { fileName } = req.body;

    if (!fileName) {
      res.status(400).json({ error: 'fileName is required in the request body.' });
      return;
    }

    const zipPath = path.resolve(
      __dirname,
      '../../../../libraries/downloader/downloads',
      'output_files',
      fileName
    );
    const outputDir = path.resolve(
      __dirname,
      '../../../../libraries/unzipper/unzipped',
      'extracted_files'
    );

    if (!fs.existsSync(zipPath)) {
      res.status(404).json({ error: `File "${fileName}" does not exist.` });
      return;
    }

    try {
      await unzipFile(zipPath, outputDir);
      res.status(200).json({ message: `Extraction of "${fileName}" completed.` });
    } catch (error: any) {
      logger.logError(new Error(`Failed to extract "${fileName}": ${error.message}`));
      res.status(500).json({ error: `Failed to extract "${fileName}".` });
    }
  }
);

export default router;
