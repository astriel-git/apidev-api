import pkg from 'pg'
import fs from 'fs'
import readline from 'readline'
import { pipeline, Transform } from 'stream'
import { promisify } from 'util'
import { parse } from 'csv-parse'
import { from as copyFrom } from 'pg-copy-streams'
import cliProgress from 'cli-progress'
import path from 'path'
import iconv from 'iconv-lite'

const { Client } = pkg
const pipelineAsync = promisify(pipeline)

async function getFileLineCount (filePath) {
  const fileStream = fs.createReadStream(filePath)
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  })
  let lineCount = 0
  for await (const line of rl) { // eslint-disable-line no-unused-vars
    lineCount++
  }
  return lineCount
}

async function copyCSVToTable (client, csvFilePath, progressBar) {
  const fileStream = fs.createReadStream(csvFilePath).pipe(iconv.decodeStream('windows-1252'))
  const parser = parse({
    delimiter: ';',
    quote: '"',
    escape: '"',
    from_line: 1,
    trim: true
  })

  const maxLengths = {
    codigo: 6,
    descricao: 255
  }

  const transformStream = new Transform({
    writableObjectMode: true,
    transform (chunk, encoding, callback) {
      try {
        const row = chunk.map((value, index) => {
          value = value.trim()

          if (value.startsWith('"') && value.endsWith('"')) {
            let insideQuote = false
            value = value.split('').filter((char, i, arr) => {
              if (char === '"') {
                insideQuote = !insideQuote
                if (i === 0 || i === arr.length - 1) return true
                return !insideQuote
              }
              return true
            }).join('')
          }

          if (index === 4) {
            const firstQuote = value.indexOf('"')
            const lastQuote = value.lastIndexOf('"')
            const innerValue = value.slice(firstQuote + 1, lastQuote)
            value = value.slice(0, firstQuote + 1) + innerValue.replace(/"/g, '') + value.slice(lastQuote)
          }

          if (value === undefined || value === '') {
            return '\\N'
          }

          const maxLength = maxLengths[Object.keys(maxLengths)[index]]
          return value.substring(0, maxLength)
        }).join(';') + '\n'

        callback(null, row)
        progressBar.increment()
      } catch (error) {
        callback(error)
      }
    }
  })

  const copyStream = client.query(copyFrom(
    'COPY naturezas ("codigo", "descricao") FROM STDIN WITH CSV DELIMITER \';\' QUOTE \'"\' ESCAPE \'"\' NULL \'\\N\''
  ))

  try {
    await pipelineAsync(fileStream, parser, transformStream, copyStream)
  } catch (error) {
    console.error('Error during the COPY operation:', error)
    throw error
  }
}

async function main () {
  const client = new Client({
    user: 'postgres',
    host: '177.136.77.200',
    database: 'apiconsultas',
    password: '44c1561a333189117983c5e060ce723a',
    port: 27815
  })

  try {
    await client.connect()
    console.log('Connected to the database.')
    const csvFiles = [
      '../../unzipper/unzipped/Naturezas/F.K03200$Z.D40713.NATJUCSV'
    ]
    const multiBar = new cliProgress.MultiBar({
      clearOnComplete: false,
      hideCursor: true,
      format: ' {bar} | {percentage}% | {value}/{total} | {filename}'
    }, cliProgress.Presets.shades_classic)

    for (const csvFilePath of csvFiles) {
      const filename = path.basename(csvFilePath)
      const totalLines = await getFileLineCount(csvFilePath)
      const progressBar = multiBar.create(totalLines, 0, { filename })

      try {
        await copyCSVToTable(client, csvFilePath, progressBar)
      } catch (error) {
        console.error(`Error processing ${filename}: ${error}`)
      }

      progressBar.stop()
    }
    multiBar.stop()

    console.log('All CSV files loaded successfully.')
  } catch (error) {
    console.error('Error connecting to the database or during the COPY operation:', error)
  } finally {
    try {
      await client.end()
      console.log('Disconnected from the database.')
    } catch (error) {
      console.error('Error during disconnection:', error)
    }
  }
}

main().catch(console.error)
