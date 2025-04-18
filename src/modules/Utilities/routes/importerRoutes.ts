// src/apps/LibRoutes/entry-points/api/importerRoutes.ts

import * as express from 'express';
import type { Request, Response } from 'express';
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
  '/import',
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

    if (!category || !validCategories.includes(category.value)) {
      res.status(400).json({ error: 'Invalid or missing "category" in the request body.' });
      return;
    }

    const extractedDir = path.resolve(__dirname, '../../../utils/unzipper/', 'unzipped');

    try {
      const client = await connectDB();

      // Fetch files with the category keyword (case-insensitive)
      const files = fs
        .readdirSync(extractedDir)
        .filter(file => file.toLowerCase().includes(category.value.toLowerCase()));
        console.log('got here')

      if (files.length === 0) {
        await client.end();
        res.status(404).json({ error: `No files found for category "${category.value}".` });
        return;
      }

      await processCategory(client, files, category.value, extractedDir);
      await client.end();

      res.status(200).json({ message: `Data import for category "${category.value}" completed successfully.` });
    } catch (error: any) {
      console.error(`Error importing data for category "${category.value}": ${error.message}`);
      res.status(500).json({ error: `Failed to import data for category "${category}".` });
    }
  }
);

export default router;
