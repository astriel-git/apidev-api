import pkg from 'pg'
import fs from 'fs'
import readline from 'readline'
import { pipeline, Transform } from 'stream'
import { promisify } from 'util'
import { parse } from 'csv-parse'
import { from as copyFrom } from 'pg-copy-streams'
import cliProgress from 'cli-progress'
import path from 'path'

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
  const fileStream = fs.createReadStream(csvFilePath)
  const parser = parse({
    delimiter: ';',
    quote: '"',
    escape: '"',
    from_line: 1,
    trim: true
  })

  const maxLengths = {
    cnpjBasico: 8,
    cnpjOrdem: 4,
    cnpjDv: 2,
    identificadorMatrizFilial: 1,
    nomeFantasia: 255,
    situacaoCadastral: 2,
    dataSituacaoCadastral: 27,
    motivoSituacaoCadastral: 10,
    nomeCidadeExterior: 255,
    pais: 10,
    dataInicioAtividade: 27,
    cnaeFiscalPrincipal: 255,
    cnaeFiscalSecundaria: 255,
    tipoLogradouro: 255,
    logradouro: 255,
    numero: 255,
    complemento: 255,
    bairro: 255,
    cep: 20,
    uf: 2,
    municipio: 10,
    ddd1: 4,
    telefone1: 20,
    ddd2: 4,
    telefone2: 20,
    dddFax: 4,
    fax: 20,
    correioEletronico: 255,
    situacaoEspecial: 255,
    dataSituacaoEspecial: 27
  }

  const transformStream = new Transform({
    writableObjectMode: true,
    transform (chunk, encoding, callback) {
      try {
        const row = chunk.map((value, index) => {
          // Trim the value
          value = value.trim()

          // // Handle nested quotes by removing unnecessary double quotes
          // if (value.startsWith('"') && value.endsWith('"')) {
          //   let insideQuote = false
          //   value = value.split('').filter((char, i, arr) => {
          //     if (char === '"') {
          //       insideQuote = !insideQuote
          //       if (i === 0 || i === arr.length - 1) return true
          //       return !insideQuote
          //     }
          //     return true
          //   }).join('')
          // }

          // // Remove unnecessary inner quotes and replace inner semicolons with commas for index 16 (razaoSocial)
          // if (index === 16) {
          //   // Remove unnecessary inner quotes
          //   let insideQuote = false
          //   value = value.split('').filter((char, i, arr) => {
          //     if (char === '"') {
          //       insideQuote = !insideQuote
          //       if (i === 0 || i === arr.length - 1) return true // Keep the first and last quotes
          //       return !insideQuote // Remove inner quotes if not the first or last
          //     }
          //     return true
          //   }).join('')

          //   // Replace all inner semicolons with commas
          //   const firstQuote = value.indexOf('"')
          //   const lastQuote = value.lastIndexOf('"')
          //   if (firstQuote !== -1 && lastQuote !== -1) { // Ensure quotes exist before proceeding
          //     const innerValue = value.slice(firstQuote + 1, lastQuote)
          //     value = value.slice(0, firstQuote + 1) + innerValue.replace(/;/g, ',') + value.slice(lastQuote)
          //   }
          // }

          // Replace all invalid characters with nothing
          value = value
            .replace(/[^a-zA-Z0-9@., ";]/g, '') // Remove everything except letters, numbers, @, ., ,, space, ", and ;
            .replace(/[";]/g, "'") // Replace " and ; with single quotes

          // Handle undefined or empty values
          if (value === undefined || value === '') {
            return '\\N' // Represent NULL in PostgreSQL COPY
          }

          // Truncate value to the max length allowed
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
    'COPY estabelecimentos ("cnpjBasico", "cnpjOrdem", "cnpjDv", "identificadorMatrizFilial", "nomeFantasia", "situacaoCadastral", "dataSituacaoCadastral", "motivoSituacaoCadastral", "nomeCidadeExterior", "pais", "dataInicioAtividade", "cnaeFiscalPrincipal", "cnaeFiscalSecundaria", "tipoLogradouro", "logradouro", "numero", "complemento", "bairro", "cep", "uf", "municipio", "ddd1", "telefone1", "ddd2", "telefone2", "dddFax", "fax", "correioEletronico", "situacaoEspecial", "dataSituacaoEspecial") FROM STDIN WITH CSV DELIMITER \';\' QUOTE \'"\' ESCAPE \'"\' NULL \'\\N\''
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
      '../../unzipper/unzipped/Estabelecimentos/K3241.K03200Y0.D40713.ESTABELE',
      '../../unzipper/unzipped/Estabelecimentos/K3241.K03200Y1.D40713.ESTABELE',
      '../../unzipper/unzipped/Estabelecimentos/K3241.K03200Y2.D40713.ESTABELE',
      '../../unzipper/unzipped/Estabelecimentos/K3241.K03200Y3.D40713.ESTABELE',
      '../../unzipper/unzipped/Estabelecimentos/K3241.K03200Y4.D40713.ESTABELE',
      '../../unzipper/unzipped/Estabelecimentos/K3241.K03200Y5.D40713.ESTABELE',
      '../../unzipper/unzipped/Estabelecimentos/K3241.K03200Y6.D40713.ESTABELE',
      '../../unzipper/unzipped/Estabelecimentos/K3241.K03200Y7.D40713.ESTABELE',
      '../../unzipper/unzipped/Estabelecimentos/K3241.K03200Y8.D40713.ESTABELE',
      '../../unzipper/unzipped/Estabelecimentos/K3241.K03200Y9.D40713.ESTABELE'
    ]

    // Enhanced progress bar
    const multiBar = new cliProgress.MultiBar({
      clearOnComplete: false,
      hideCursor: true,
      format: ' {bar} | {percentage}% | {value}/{total} | {filename}'
    }, cliProgress.Presets.shades_classic)

    for (const csvFilePath of csvFiles) {
      const filename = path.basename(csvFilePath)
      const totalLines = await getFileLineCount(csvFilePath)
      const progressBar = multiBar.create(totalLines, 0, { filename }) // Add filename to progress bar

      try {
        await copyCSVToTable(client, csvFilePath, progressBar)
      } catch (error) {
        console.error(`Error processing ${filename}: ${error}`)
      }

      progressBar.stop() // Stop individual file progress bar
    }
    multiBar.stop() // Stop the main progress bar

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
