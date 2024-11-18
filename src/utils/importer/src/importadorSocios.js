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
    cnpjBasico: 8,
    identificadorSocio: 1,
    nomeSocio: 150,
    cnpjCpfSocio: 14,
    qualificacaoSocio: 2,
    dataEntradaSociedade: 8,
    pais: 3,
    representanteLegal: 1,
    nomeRepresentante: 150,
    qualificacaoRepresentante: 2,
    faixaEtaria: 2
  }

  const transformStream = new Transform({
    writableObjectMode: true,
    transform (chunk, encoding, callback) {
      const row = chunk.map((value, index) => {
        value = value.trim()

        // Handle any fields that require special handling, e.g., removing inner quotes
        if (index === 2 || index === 8) { // nomeSocio or nomeRepresentante
          if (value.startsWith('"') && value.endsWith('"')) {
            value = value.slice(1, -1).replace(/"/g, '')
          }
        }

        // Enforce max length constraint
        const maxLength = maxLengths[Object.keys(maxLengths)[index]]
        value = value ? value.substring(0, maxLength) : '\\N'

        return value
      }).join(';') + '\n'

      callback(null, row)
      progressBar.increment()
    }
  })

  const copyStream = client.query(copyFrom(
    'COPY socios ("cnpjBasico", "identificadorSocio", "nomeSocio", "cnpjCpfSocio", "qualificacaoSocio", "dataEntradaSociedade", "pais", "representanteLegal", "nomeRepresentante", "qualificacaoRepresentante", "faixaEtaria") FROM STDIN WITH CSV DELIMITER \';\' QUOTE \'"\' ESCAPE \'\\\' NULL \'\\N\''
  ))

  try {
    await pipelineAsync(fileStream, parser, transformStream, copyStream)
  } catch (error) {
    console.error('Error during the COPY operation:', error)
    throw error // Re-throw the error to handle it in the main function
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
      '../../unzipper/unzipped/Socios/K3241.K03200Y0.D40713.SOCIOCSV',
      '../../unzipper/unzipped/Socios/K3241.K03200Y1.D40713.SOCIOCSV',
      '../../unzipper/unzipped/Socios/K3241.K03200Y2.D40713.SOCIOCSV',
      '../../unzipper/unzipped/Socios/K3241.K03200Y3.D40713.SOCIOCSV',
      '../../unzipper/unzipped/Socios/K3241.K03200Y4.D40713.SOCIOCSV',
      '../../unzipper/unzipped/Socios/K3241.K03200Y5.D40713.SOCIOCSV',
      '../../unzipper/unzipped/Socios/K3241.K03200Y6.D40713.SOCIOCSV',
      '../../unzipper/unzipped/Socios/K3241.K03200Y7.D40713.SOCIOCSV',
      '../../unzipper/unzipped/Socios/K3241.K03200Y8.D40713.SOCIOCSV',
      '../../unzipper/unzipped/Socios/K3241.K03200Y9.D40713.SOCIOCSV'
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
    await client.end()
    console.log('Disconnected from the database.')
  }
}

main().catch(console.error)
