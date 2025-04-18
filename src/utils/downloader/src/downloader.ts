// src/libraries/downloader/src/downloader.ts
import fs from 'fs-extra';
import path from 'path';
import axios, { AxiosError } from 'axios';
import cliProgress from 'cli-progress';
import * as cheerio from 'cheerio';

export interface DownloadProgress {
  fileName: string;
  progress: number;
  status: 'downloading' | 'completed' | 'error';
  error?: string;
}

export type ProgressCallback = (progress: DownloadProgress) => void;

interface FileInfo {
  url: string;
  fileName: string;
  size: number;
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 5000; // 5 seconds

/**
 * Checks if a file needs to be downloaded based on its size and last modified date.
 */
async function checkDiff(url: string, filePath: string): Promise<boolean> {
  if (!fs.existsSync(filePath)) {
    return true;
  }

  try {
    const response = await axios.head(url);
    const newSize = parseInt(response.headers['content-length'] || '0', 10);
    const newLastModified = response.headers['last-modified'];
    const stats = await fs.stat(filePath);
    const oldSize = stats.size;
    const oldLastModified = stats.mtime.toUTCString();

    if (newSize !== oldSize || newLastModified !== oldLastModified) {
      await fs.remove(filePath);
      return true;
    }

    return false;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error(`Error checking file difference for ${url}:`, error.message);
    }
    return false;
  }
}

/**
 * Downloads a file with retry mechanism and progress tracking.
 */
async function downloadFile(
  url: string,
  outputDir: string,
  onProgress?: ProgressCallback
): Promise<void> {
  const fileName = path.basename(url);
  const filePath = path.join(outputDir, fileName);
  let retryCount = 0;

  const shouldDownload = await checkDiff(url, filePath);
  if (!shouldDownload) {
    onProgress?.({
      fileName,
      progress: 100,
      status: 'completed'
    });
    return;
  }

  while (retryCount < MAX_RETRIES) {
    try {
      const response = await axios({
        method: 'GET',
        url,
        responseType: 'stream',
        timeout: 30000, // 30 seconds timeout
        validateStatus: (status) => status === 200
      });

      const totalLength = parseInt(response.headers['content-length'], 10);
      let downloaded = 0;

      onProgress?.({
        fileName,
        progress: 0,
        status: 'downloading'
      });

      const progressBar = new cliProgress.SingleBar(
        {
          format: '{bar} {percentage}% | {value}/{total} bytes | ETA: {eta}s',
          barCompleteChar: '\u2588',
          barIncompleteChar: '\u2591',
          hideCursor: true
        },
        cliProgress.Presets.shades_classic
      );

      progressBar.start(totalLength, 0);

      const writer = fs.createWriteStream(filePath);
      const dataStream = response.data as NodeJS.ReadableStream;

      dataStream.on('data', (chunk: Buffer) => {
        downloaded += chunk.length;
        progressBar.update(downloaded);
        const progress = Math.round((downloaded / totalLength) * 100);
        onProgress?.({
          fileName,
          progress,
          status: 'downloading'
        });
      });

      await new Promise<void>((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
        dataStream.pipe(writer);
      });

      progressBar.stop();
      onProgress?.({
        fileName,
        progress: 100,
        status: 'completed'
      });
      return;
    } catch (error) {
      retryCount++;
      if (retryCount === MAX_RETRIES) {
        onProgress?.({
          fileName,
          progress: 0,
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
        throw error;
      }
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
    }
  }
}

/**
 * Fetches and downloads files for specified categories with improved error handling and case-insensitive matching.
 */
async function downloadFilesForCategories(
  baseUrl: string,
  outputDir: string,
  categories: string[],
  onProgress?: ProgressCallback
): Promise<FileInfo[]> {
  try {
    const { data } = await axios.get<string>(baseUrl, {
      timeout: 10000,
      validateStatus: (status) => status === 200
    });

    const $ = cheerio.load(data);
    const filesToDownload: FileInfo[] = [];

    // Prepare lowercase categories for case-insensitive matching
    const targetCats = categories.map(c => c.toLowerCase());

    $('a').each((_, element) => {
      const href = $(element).attr('href');
      if (!href || !href.toLowerCase().endsWith('.zip')) {
        return;
      }

      const nameLower = href.toLowerCase();
      for (const cat of targetCats) {
        if (nameLower.startsWith(cat)) {
          filesToDownload.push({
            url: `${baseUrl}${href}`,
            fileName: href,
            size: 0
          });
          break; // stop after the first matching category
        }
      }
    });

    if (filesToDownload.length === 0) {
      throw new Error('No files found for the selected categories');
    }

    const downloadedFiles: FileInfo[] = [];
    for (const file of filesToDownload) {
      try {
        await downloadFile(file.url, outputDir, onProgress);
        const stats = await fs.stat(path.join(outputDir, file.fileName));
        downloadedFiles.push({
          ...file,
          size: stats.size
        });
      } catch (error) {
        console.error(`Failed to download ${file.fileName}:`, error);
        throw error;
      }
    }

    return downloadedFiles;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('Network error:', error.message);
    }
    throw error;
  }
}

export default { downloadFile, downloadFilesForCategories };
