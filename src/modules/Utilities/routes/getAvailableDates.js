import { Router } from 'express'
import axios from 'axios'
import * as cheerio from 'cheerio'

const router = Router()
const baseUrl = 'https://arquivos.receitafederal.gov.br/cnpj/dados_abertos_cnpj/'

// Endpoint to fetch available dates
router.get('/', async (req, res) => {
  try {
    // Fetch the HTML content
    const { data } = await axios.get(baseUrl)
    console.log('Fetched HTML content successfully.') // Debug log

    const $ = cheerio.load(data)
    const availableDates = []

    // Parse each directory link with a date format
    $('a').each((_, element) => {
      const href = $(element).attr('href')
      if (href && /^\d{4}-\d{2}\/$/.test(href)) {
        console.log(`Found date directory: ${href}`) // Debug log
        availableDates.push(href.replace('/', ''))
      }
    })

    // Check if any dates were found
    if (availableDates.length === 0) {
      console.warn('No dates found in the HTML.') // Debug log
    }

    res.status(200).json({ dates: availableDates })
  } catch (error) {
    console.error('Error fetching available dates:', error.message)
    res.status(500).json({ error: 'Failed to retrieve dates' })
  }
})

export default router
