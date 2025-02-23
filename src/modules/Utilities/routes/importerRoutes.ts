// src/apps/LibRoutes/entry-points/api/importerRoutes.ts

import * as express from 'express';
import type { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import databaseImporter from '../../../utils/importer/src/databaseImporter.ts';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Endpoint to import data for a specific category.
 * Expects 'category' in the request body.
 */
const router = express.Router();
const { connectDB, processCategory } = databaseImporter;

interface ImporterRequestBody {
  category: string;
}

router.post(
  '/',
  async (req: Request<{}, {}, ImporterRequestBody>, res: Response): Promise<void> => {
    const { category } = req.body;

    const validCategories = [
      'empresa',
      'estabelecimento',
      'socios',
      'simples',
      'cnae',
      'moti',
      'munic',
      'natju',
      'pais',
      'quals'
    ];

    if (!category || !validCategories.includes(category)) {
      res.status(400).json({ error: 'Invalid or missing "category" in the request body.' });
      return;
    }

    const extractedDir = path.resolve(__dirname, '../../../../libraries/unzipper/unzipped/', 'extracted_files');

    try {
      const client = await connectDB();

      // Fetch files with the category keyword (case-insensitive)
      const files = fs
        .readdirSync(extractedDir)
        .filter(file => file.toLowerCase().includes(category.toLowerCase()));

      if (files.length === 0) {
        await client.end();
        res.status(404).json({ error: `No files found for category "${category}".` });
        return;
      }

      await processCategory(client, files, category, extractedDir);
      await client.end();

      res.status(200).json({ message: `Data import for category "${category}" completed successfully.` });
    } catch (error: any) {
      console.error(`Error importing data for category "${category}": ${error.message}`);
      res.status(500).json({ error: `Failed to import data for category "${category}".` });
    }
  }
);

export default router;
