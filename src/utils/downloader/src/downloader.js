// src/libraries/downloader/src/downloader.js
import fs from 'fs-extra'
import path from 'path'
import axios from 'axios'
import cliProgress from 'cli-progress'
import * as cheerio from 'cheerio'

/**
 * Checks if a file needs to be downloaded based on its size.
 * @param {string} url - The URL of the file.
 * @param {string} filePath - The local file path.
 * @returns {Promise<boolean>} - Whether to download the file.
 */
async function checkDiff (url, filePath) {
  if (!fs.existsSync(filePath)) {
    return true // File does not exist
  }

  try {
    const response = await axios.head(url)
    const newSize = parseInt(response.headers['content-length'] || '0', 10)
    const stats = await fs.stat(filePath)
    const oldSize = stats.size

    if (newSize !== oldSize) {
      await fs.remove(filePath)
      return true // Sizes differ
    }

    return false // Sizes are the same
  } catch (error) {
    console.error(`Error checking file difference for ${url}:`, error.message)
    return false
  }
}

/**
 * Downloads a file with a progress callback.
 * @param {string} url - The URL of the file.
 * @param {string} outputDir - The directory to save the file.
 * @param {Function} onProgress - Callback to send progress updates.
 */
async function downloadFile (url, outputDir, onProgress) {
  const fileName = path.basename(url)
  const filePath = path.join(outputDir, fileName)

  const shouldDownload = await checkDiff(url, filePath)
  if (!shouldDownload) {
    onProgress && onProgress(`File "${fileName}" is already up to date. Skipping download.`)
    return
  }

  try {
    const response = await axios({
      method: 'GET',
      url,
      responseType: 'stream'
    })

    const totalLength = parseInt(response.headers['content-length'], 10)
    let downloaded = 0

    onProgress && onProgress(`Starting download of "${fileName}"...`)
    const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic)
    progressBar.start(totalLength, 0)

    const writer = fs.createWriteStream(filePath)
    response.data.on('data', (chunk) => {
      downloaded += chunk.length
      progressBar.update(downloaded)

      // Send download progress as a percentage
      const progress = Math.round((downloaded / totalLength) * 100)
      onProgress && onProgress(`Downloading "${fileName}": ${progress}%`)
    })

    response.data.pipe(writer)

    await new Promise((resolve, reject) => {
      writer.on('finish', resolve)
      writer.on('error', reject)
    })

    progressBar.stop()
    onProgress && onProgress(`Downloaded "${fileName}" successfully.`)
  } catch (error) {
    onProgress && onProgress(`Error downloading "${fileName}": ${error.message}`)
  }
}

/**
 * Fetches all files for the specified categories and downloads them.
 * @param {string} baseUrl - The base URL to build the file URLs.
 * @param {string} outputDir - The directory to save the files.
 * @param {Array} categories - List of categories selected for download.
 * @param {Function} onProgress - Callback to send progress updates.
 */
async function downloadFilesForCategories (baseUrl, outputDir, categories, onProgress) {
  try {
    const { data } = await axios.get(baseUrl)
    const $ = cheerio.load(data)
    const filesToDownload = []

    // Find all files related to the selected categories
    $('a').each((_, element) => {
      const href = $(element).attr('href')
      if (href) {
        categories.forEach((category) => {
          if (href.startsWith(category) && href.endsWith('.zip')) {
            filesToDownload.push(`${baseUrl}${href}`)
          }
        })
      }
    })

    // Download each file and emit progress
    for (const fileUrl of filesToDownload) {
      await downloadFile(fileUrl, outputDir, onProgress)
    }
    onProgress && onProgress('All selected category files downloaded successfully.')
  } catch (error) {
    console.error(`Error fetching files for categories: ${error.message}`)
    onProgress && onProgress(`Error fetching files: ${error.message}`)
    throw error
  }
}

export default { downloadFile, downloadFilesForCategories }
