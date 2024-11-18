// src/apps/LibRoutes/entry-points/api/downloaderRoutes.js
import { Router } from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import downloader from '../../../utils/downloader/src/downloader.js'
// import logger from '../../../../utils/logger.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const router = Router()
const { downloadFilesForCategories } = downloader

router.post('/', async (req, res) => {
  const { date, categories } = req.body

  if (!date || !categories || !Array.isArray(categories) || categories.length === 0) {
    return res.status(400).json({ error: 'Date and a list of categories are required in the request body.' })
  }

  const baseUrl = `https://arquivos.receitafederal.gov.br/cnpj/dados_abertos_cnpj/${date}/`
  const outputDir = path.resolve(__dirname, '../../../../libraries/downloader/downloads', 'output_files')

  try {
    // Pass the base URL, output directory, and categories to downloader
    await downloadFilesForCategories(baseUrl, outputDir, categories)
    res.status(200).json({ message: 'Download of selected categories completed successfully.' })
  } catch (error) {
    console.error(`Failed to download files for categories: ${error.message}`)
    res.status(500).json({ error: 'Failed to download files for selected categories.' })
  }
})

export default router
