// src/apps/LibRoutes/entry-points/api/importerRoutes.js

import { Router } from 'express'
import path from 'path'
import fs from 'fs'
import databaseImporter from '../../../utils/importer/src/databaseImporter.js'
// import logger from '../../../../utils/logger.js'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * Endpoint to import data for a specific category.
 * Expects 'category' in the request body.
 */
const router = Router()
const { connectDB, processCategory } = databaseImporter

router.post('/', async (req, res) => {
  const { category } = req.body

  const validCategories = ['empresa', 'estabelecimento', 'socios', 'simples', 'cnae', 'moti', 'munic', 'natju', 'pais', 'quals']

  if (!category || !validCategories.includes(category)) {
    return res.status(400).json({ error: 'Invalid or missing "category" in the request body.' })
  }

  const extractedDir = path.resolve(__dirname, '../../../../libraries/unzipper/unzipped/', 'extracted_files')

  try {
    const client = await connectDB()

    // Fetch files with the category keyword (e.g., "cnae") in any part of the name, case-insensitive
    const files = fs.readdirSync(extractedDir).filter(file => file.toLowerCase().includes(category.toLowerCase()))

    if (files.length === 0) {
      await client.end()
      return res.status(404).json({ error: `No files found for category "${category}".` })
    }

    await processCategory(client, files, category, extractedDir)

    await client.end()

    res.status(200).json({ message: `Data import for category "${category}" completed successfully.` })
  } catch (error) {
    console.error(`Error importing data for category "${category}": ${error.message}`)
    res.status(500).json({ error: `Failed to import data for category "${category}".` })
  }
})

export default router
