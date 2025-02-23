import fs from 'fs-extra';
import path from 'path';
import StreamZip from 'node-stream-zip';

/**
 * Extracts a ZIP file to the specified directory.
 * @param zipPath - Path to the ZIP file.
 * @param outputDir - Directory to extract files into.
 */
async function unzipFile(zipPath: string, outputDir: string): Promise<void> {
  // Ensure output directory exists
  await fs.ensureDir(outputDir);

  const zip = new StreamZip.async({ file: zipPath });
  try {
    console.log(`Extracting "${path.basename(zipPath)}" to "${outputDir}"...`);
    await zip.extract(null, outputDir);
    console.log(`Extraction of "${path.basename(zipPath)}" completed successfully.`);
  } catch (error: any) {
    console.error(`Error extracting "${path.basename(zipPath)}":`, error.message);
    throw error; // rethrow to handle in calling function
  } finally {
    await zip.close();
  }
}

export default unzipFile;
