import fs from 'fs-extra';
import path from 'path';
import StreamZip from 'node-stream-zip';
import { createHash } from 'crypto';

export interface UnzipProgress {
  fileName: string;
  progress: number;
  status: 'extracting' | 'completed' | 'error';
  error?: string;
}

export type ProgressCallback = (progress: UnzipProgress) => void;

/**
 * Calculates the MD5 hash of a file.
 */
async function calculateFileHash(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const hash = createHash('md5');
    const stream = fs.createReadStream(filePath);
    
    stream.on('error', reject);
    stream.on('data', chunk => hash.update(chunk));
    stream.on('end', () => resolve(hash.digest('hex')));
  });
}

/**
 * Validates if a file is a valid ZIP file.
 */
async function validateZipFile(zipPath: string): Promise<boolean> {
  try {
    const zip = new StreamZip.async({ file: zipPath });
    await zip.close();
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Extracts a ZIP file with progress tracking and validation.
 */
async function unzipFile(
  zipPath: string,
  outputDir: string,
  onProgress?: ProgressCallback
): Promise<void> {
  const fileName = path.basename(zipPath);

  try {
    // Validate ZIP file
    const isValid = await validateZipFile(zipPath);
    if (!isValid) {
      throw new Error('Invalid ZIP file');
    }

    // Ensure output directory exists
    await fs.ensureDir(outputDir);

    // Calculate original file hash
    const originalHash = await calculateFileHash(zipPath);

    const zip = new StreamZip.async({ file: zipPath });
    const entries = await zip.entries();
    const totalEntries = Object.keys(entries).length;
    let processedEntries = 0;

    onProgress?.({
      fileName,
      progress: 0,
      status: 'extracting'
    });

    // Extract files with progress tracking
    for (const entry of Object.values(entries)) {
      if (entry.isDirectory) {
        await fs.ensureDir(path.join(outputDir, entry.name));
      } else {
        await zip.extract(entry.name, path.join(outputDir, entry.name));
      }

      processedEntries++;
      const progress = Math.round((processedEntries / totalEntries) * 100);
      onProgress?.({
        fileName,
        progress,
        status: 'extracting'
      });
    }

    await zip.close();

    // Verify extraction by checking if all files were extracted
    const extractedFiles = await fs.readdir(outputDir);
    if (extractedFiles.length === 0) {
      throw new Error('No files were extracted');
    }

    // Verify file integrity
    const extractedHash = await calculateFileHash(zipPath);
    if (extractedHash !== originalHash) {
      throw new Error('File integrity check failed');
    }

    onProgress?.({
      fileName,
      progress: 100,
      status: 'completed'
    });
  } catch (error) {
    onProgress?.({
      fileName,
      progress: 0,
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    throw error;
  }
}

export default unzipFile;
