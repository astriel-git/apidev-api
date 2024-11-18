// src/apps/LibRoutes/entry-points/api/unzipperRoutes.js

import { Router } from 'express'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import unzipFile from '../../../utils/unzipper/src/unzipper.js'
import logger from '../../../core/utils/logger.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const router = Router()

// Endpoint to unzip a specific file
router.post('/', async (req, res) => {
  const { fileName } = req.body

  if (!fileName) {
    return res.status(400).json({ error: 'fileName is required in the request body.' })
  }

  const zipPath = path.resolve(__dirname, '../../../../libraries/downloader/downloads', 'output_files', fileName)
  const outputDir = path.resolve(__dirname, '../../../../libraries/unzipper/unzipped', 'extracted_files')

  if (!fs.existsSync(zipPath)) {
    return res.status(404).json({ error: `File "${fileName}" does not exist.` })
  }

  try {
    await unzipFile(zipPath, outputDir)
    res.status(200).json({ message: `Extraction of "${fileName}" completed.` })
  } catch (error) {
    logger.error(`Failed to extract "${fileName}": ${error.message}`)
    res.status(500).json({ error: `Failed to extract "${fileName}".` })
  }
})

export default router
