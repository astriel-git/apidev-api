// import fs from 'fs';
import path from 'path';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { fileURLToPath } from 'url';
import logger from '../../../core/utils/logger.ts';
import type * as UtilInterface from '../types/utilsTypes.ts';
import unzipFile from '../../../utils/unzipper/src/unzipper.ts';
import downloader from '../../../utils/downloader/src/downloader.ts';
import databaseImporter from '../../../utils/importer/src/databaseImporter.ts';
import fs from 'fs';


const baseUrl = 'https://arquivos.receitafederal.gov.br/cnpj/dados_abertos_cnpj/';

export const util = {
  async fetchDates(): Promise<UtilInterface.FetchDateResponse> {
    try {
      // Fetch the HTML from Receita Federal
      const { data } = await axios.get<string>(baseUrl);

      // Load into cheerio and extract YYYY‑MM directories
      const $ = cheerio.load(data);
      const availableDates: string[] = [];

      $('a').each((_, el) => {
        const href = $(el).attr('href');
        if (href && /^\d{4}-\d{2}\/$/.test(href)) {
          availableDates.push(href.replace('/', ''));
        }
      });

      if (availableDates.length === 0) {
        console.warn('No date directories found at:', baseUrl);
      }

      return { dates: availableDates };
    } catch (err) {
      console.error('Failed to fetch or parse dates:', err);
      // Either rethrow or return an empty list—your call
      return { dates: [] };
    }
  },

  async parseCategories(date: string): Promise<UtilInterface.ParseCategoriesResponse> {
    try {
      const { data } = await axios.get<string>(`${baseUrl}${date}/`);
      const $ = cheerio.load(data);
      const categorySet = new Set<string>();

      $('a').each((_, el) => {
        const href = $(el).attr('href');
        if (href) {
          const match = href.match(/^([A-Za-z]+)\d*\.zip$/);
          if (match) {
            categorySet.add(match[1]);
          }
        }
      });

      return { categories: Array.from(categorySet) };
    } catch (err) {
      console.error('Error fetching categories:', err);
      throw new Error('Failed to retrieve categories');
    }
  },

  async downloadCategoriesFiles(
    date: string,
    categories: string[]
  ): Promise<UtilInterface.DownloadFilesResponse> {
    // Build a per-date output directory
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const outputDir = path.resolve(
      __dirname,
      '../../../utils/downloader/downloaded'
    );

    try {
      // Ensure the URL ends with a slash
      const downloadUrl = `${baseUrl}${date}/`;

      // *** CALL THE RIGHT METHOD ***
      // Returns FileInfo[]: { url, fileName, size }
      const fileInfos = await downloader.downloadFilesForCategories(
        downloadUrl,
        outputDir,
        categories
      );

      // Map to your DownloadFilesResponse type (string paths)
      const files = fileInfos.map(fi => path.join(outputDir, fi.fileName));

      return { files };
    } catch (err) {
      console.error('Error downloading files:', err);
      // Bubble up as a generic Error; your service layer will wrap it
      throw new Error('Failed to download files from Receita Federal');
    }
  },

  /** Unzip each downloaded .zip file and return the list of extraction dirs */
  async unzipFiles(
    fileName: string
  ): Promise<UtilInterface.UnzipFilesResponse> {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    // where you downloaded it
    const zipPath = path.resolve(
      __dirname,
      '../../../utils/downloader/downloaded',
      `${fileName}.zip`
    );

    // where you want to extract
    const outputDir = path.resolve(
      __dirname,
      '../../../utils/unzipper/unzipped',
      fileName
    );

    try {
      await unzipFile(zipPath, outputDir);
      return { unzippedDirs: [outputDir] };
    } catch (err) {
      logger.error(`unzipFiles failed for ${fileName}:`, err);
      throw new Error(`Failed to unzip file: ${fileName}`);
    }
    },

  /**
     * Import all CSV files for a given category.
     * Flattens sub-folders under unzipped/, then hands exact file names to processCategory.
     */
  async importFiles(
    category: string
  ): Promise<UtilInterface.ImportFilesResponse> {
    const { connectDB, processCategory } = databaseImporter;
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    // Where unzipper dropped everything (possibly in subfolders)
    const extractedDir = path.resolve(
      __dirname,
      '../../../utils/unzipper/unzipped'
    );

    // 1) get all category subfolders
    const subfolders = fs
      .readdirSync(extractedDir)
      .filter(name => name.toLowerCase().includes(category.toLowerCase()));

    if (subfolders.length === 0) {
      throw new Error(`No unzipped directories found for "${category}"`);
    }

    // 2) flatten out actual file names relative to extractedDir
    const filesToImport: string[] = [];
    for (const folder of subfolders) {
      const folderPath = path.join(extractedDir, folder);
      const entries = fs.readdirSync(folderPath);
      for (const entry of entries) {
        const relative = path.join(folder, entry);
        // sanity check
        const abs = path.join(extractedDir, relative);
        if (fs.existsSync(abs) && fs.statSync(abs).isFile()) {
          filesToImport.push(relative);
        }
      }
    }

    if (filesToImport.length === 0) {
      throw new Error(`No files found inside "${category}" folders`);
    }

    // 3) now call processCategory exactly like your original code
    const client = await connectDB();
    try {
      await processCategory(client, filesToImport, category, extractedDir);
      await client.end();
      return { importedCount: filesToImport.length };
    } catch (err) {
      await client.end();
      throw err;
    }
  }
};


export default util;


