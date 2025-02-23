// src/apps/LibRoutes/entry-points/api/getAvailableCategories.ts
import * as express from 'express';
import type { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import * as cheerio from 'cheerio';

const router = express.Router();
const baseUrl = 'https://arquivos.receitafederal.gov.br/cnpj/dados_abertos_cnpj/';

interface GetAvailableCategoriesBody {
  date: string;
}

router.post(
  '/',
  async (req: Request<{}, {}, GetAvailableCategoriesBody>, res: Response): Promise<void> => {
    const { date } = req.body;
    if (!date) {
      res.status(400).json({ error: 'Date parameter is required in the request body' });
      return;
    }

    // Build the full URL using the date
    const url = `${baseUrl}${date}/`;
    console.log(`Fetching available categories for date: ${date}`);
    console.log(`URL: ${url}`);

    try {
      // Fetch the HTML content of the page
      const { data } = await axios.get(url);
      const $ = cheerio.load(data as string);
      const categorySet = new Set<string>();

      // Parse each link to find file names representing categories
      $('a').each((_, element) => {
        const href = $(element).attr('href');
        if (href) {
          // Extract category name from file name (e.g., "Socios0.zip" => "Socios")
          const match = href.match(/^([A-Za-z]+)\d*\.zip$/);
          if (match) {
            categorySet.add(match[1]); // Add unique category to the set
          }
        }
      });

      // Convert the set to an array and return it
      res.status(200).json({ categories: Array.from(categorySet) });
    } catch (error: any) {
      console.error('Error fetching available categories:', error.message);
      res.status(500).json({ error: 'Failed to retrieve categories' });
    }
  }
);

export default router;
