// src/libraries/importer/src/databaseimporter.js
import fs from 'fs-extra'
import path from 'path'
import csv from 'csv-parser'
import pkg from 'pg'
import dotenv from 'dotenv'

dotenv.config() // Load environment variables
/**
 * Connects to PostgreSQL.
 * @returns {object} - The PostgreSQL client.
 */
const { Client } = pkg

async function connectDB () {
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  })

  try {
    await client.connect()
    console.log('Connected to PostgreSQL database successfully.')
    return client
  } catch (error) {
    console.error('Error connecting to PostgreSQL:', error.message)
    throw error
  }
}

/**
 * Creates a table based on the category.
 * @param {object} client - The PostgreSQL client.
 * @param {string} category - The data category.
 */
async function createTable (client, category) {
  let createTableQuery = ''

  switch (category) {
    case 'empresa':
      createTableQuery = `
                CREATE TABLE IF NOT EXISTS empresa (
                    cnpj_basico VARCHAR PRIMARY KEY,
                    razao_social VARCHAR,
                    natureza_juridica VARCHAR,
                    qualificacao_responsavel VARCHAR,
                    capital_social FLOAT,
                    porte_empresa INTEGER,
                    ente_federativo_responsavel VARCHAR
                );
            `
      break

    case 'estabelecimento':
      createTableQuery = `
                CREATE TABLE IF NOT EXISTS estabelecimento (
                    cnpj_basico VARCHAR,
                    cnpj_ordem VARCHAR,
                    cnpj_dv VARCHAR,
                    identificador_matriz_filial VARCHAR,
                    nome_fantasia VARCHAR,
                    situacao_cadastral VARCHAR,
                    data_situacao_cadastral DATE,
                    motivo_situacao_cadastral VARCHAR,
                    nome_cidade_exterior VARCHAR,
                    pais VARCHAR,
                    data_inicio_atividade DATE,
                    cnae_fiscal_principal VARCHAR,
                    cnae_fiscal_secundaria VARCHAR,
                    tipo_logradouro VARCHAR,
                    logradouro VARCHAR,
                    numero VARCHAR,
                    complemento VARCHAR,
                    bairro VARCHAR,
                    cep VARCHAR,
                    uf VARCHAR,
                    municipio VARCHAR,
                    ddd_1 VARCHAR,
                    telefone_1 VARCHAR,
                    ddd_2 VARCHAR,
                    telefone_2 VARCHAR,
                    ddd_fax VARCHAR,
                    fax VARCHAR,
                    correio_eletronico VARCHAR,
                    situacao_especial VARCHAR,
                    data_situacao_especial DATE
                );
            `
      break

    case 'socios':
      createTableQuery = `
                CREATE TABLE IF NOT EXISTS socios (
                    cnpj_basico VARCHAR,
                    identificador_socio INTEGER,
                    nome_socio_razao_social VARCHAR,
                    cpf_cnpj_socio VARCHAR,
                    qualificacao_socio VARCHAR,
                    data_entrada_sociedade DATE,
                    pais VARCHAR,
                    representante_legal VARCHAR,
                    nome_do_representante VARCHAR,
                    qualificacao_representante_legal VARCHAR,
                    faixa_etaria INTEGER
                );
            `
      break

    case 'simples':
      createTableQuery = `
                CREATE TABLE IF NOT EXISTS simples (
                    cnpj_basico VARCHAR,
                    opcao_pelo_simples VARCHAR,
                    data_opcao_simples DATE,
                    data_exclusao_simples DATE,
                    opcao_mei VARCHAR,
                    data_opcao_mei DATE,
                    data_exclusao_mei DATE
                );
            `
      break

    case 'cnae':
      createTableQuery = `
                CREATE TABLE IF NOT EXISTS cnae (
                    codigo VARCHAR PRIMARY KEY,
                    descricao VARCHAR
                );
            `
      break

    case 'moti':
      createTableQuery = `
                CREATE TABLE IF NOT EXISTS moti (
                    codigo INTEGER PRIMARY KEY,
                    descricao VARCHAR
                );
            `
      break

    case 'munic':
      createTableQuery = `
                CREATE TABLE IF NOT EXISTS munic (
                    codigo INTEGER PRIMARY KEY,
                    descricao VARCHAR
                );
            `
      break

    case 'natju':
      createTableQuery = `
                CREATE TABLE IF NOT EXISTS natju (
                    codigo INTEGER PRIMARY KEY,
                    descricao VARCHAR
                );
            `
      break

    case 'pais':
      createTableQuery = `
                CREATE TABLE IF NOT EXISTS pais (
                    codigo INTEGER PRIMARY KEY,
                    descricao VARCHAR
                );
            `
      break

    case 'quals':
      createTableQuery = `
                CREATE TABLE IF NOT EXISTS quals (
                    codigo INTEGER PRIMARY KEY,
                    descricao VARCHAR
                );
            `
      break

    default:
      console.error(`No table schema defined for category: ${category}`)
      break
  }

  if (createTableQuery) {
    try {
      await client.query(createTableQuery)
      await client.query('COMMIT;')
      console.log(`Table "${category}" created successfully.`)
    } catch (error) {
      console.error(`Error creating table "${category}":`, error.message)
    }
  }
}

/**
 * Inserts data into the specified table.
 * @param {object} client - The PostgreSQL client.
 * @param {Array} data - Array of objects representing rows.
 * @param {string} tableName - The target table.
 */
async function insertData (client, data, tableName) {
  if (data.length === 0) return

  const columns = Object.keys(data[0]).map(col => `"${col}"`).join(', ')
  const values = []
  const placeholders = data.map((_, i) => {
    const index = i * Object.keys(data[0]).length
    return `(${Object.keys(data[0]).map((_, j) => `$${index + j + 1}`).join(', ')})`
  }).join(', ')

  data.forEach(row => {
    Object.values(row).forEach(value => {
      values.push(value)
    })
  })

  const query = `INSERT INTO "${tableName}" (${columns}) VALUES ${placeholders} ON CONFLICT DO NOTHING;`

  try {
    await client.query(query, values)
    console.log(`Inserted ${data.length} records into "${tableName}".`)
  } catch (error) {
    console.error(`Error inserting into "${tableName}":`, error.message)
  }
}

/**
 * Processes and inserts data from a CSV file into the database.
 * @param {object} client - The PostgreSQL client.
 * @param {string} filePath - Path to the CSV file.
 * @param {string} category - The data category.
 */
async function processFile (client, filePath, category) {
  return new Promise((resolve, reject) => {
    const results = []
    fs.createReadStream(filePath)
      .pipe(csv({ separator: ';', headers: false, encoding: 'latin1' }))
      .on('data', (data) => {
        let transformed = {}

        switch (category) {
          case 'empresa':
            transformed = {
              cnpj_basico: data['0'],
              razao_social: data['1'],
              natureza_juridica: data['2'],
              qualificacao_responsavel: data['3'],
              capital_social: data['4'] ? parseFloat(data['4'].replace(',', '.')) : null,
              porte_empresa: data['5'] !== '' ? parseInt(data['5'], 10) : null,
              ente_federativo_responsavel: data['6']
            }
            break

          case 'estabelecimento':
            transformed = {
              cnpj_basico: data['0'],
              cnpj_ordem: data['1'],
              cnpj_dv: data['2'],
              identificador_matriz_filial: data['3'],
              nome_fantasia: data['4'],
              situacao_cadastral: data['5'],
              data_situacao_cadastral: data['6'] || null,
              motivo_situacao_cadastral: data['7'],
              nome_cidade_exterior: data['8'],
              pais: data['9'],
              data_inicio_atividade: data['10'] || null,
              cnae_fiscal_principal: data['11'],
              cnae_fiscal_secundaria: data['12'],
              tipo_logradouro: data['13'],
              logradouro: data['14'],
              numero: data['15'],
              complemento: data['16'],
              bairro: data['17'],
              cep: data['18'],
              uf: data['19'],
              municipio: data['20'],
              ddd_1: data['21'],
              telefone_1: data['22'],
              ddd_2: data['23'],
              telefone_2: data['24'],
              ddd_fax: data['25'],
              fax: data['26'],
              correio_eletronico: data['27'],
              situacao_especial: data['28'],
              data_situacao_especial: data['29'] || null
            }
            break

          case 'socios':
            transformed = {
              cnpj_basico: data['0'],
              identificador_socio: data['1'] !== '' ? parseInt(data['1'], 10) : null,
              nome_socio_razao_social: data['2'],
              cpf_cnpj_socio: data['3'],
              qualificacao_socio: data['4'],
              data_entrada_sociedade: data['5'] || null,
              pais: data['6'],
              representante_legal: data['7'],
              nome_do_representante: data['8'],
              qualificacao_representante_legal: data['9'],
              faixa_etaria: data['10'] !== '' ? parseInt(data['10'], 10) : null
            }
            break

          case 'simples':
            transformed = {
              cnpj_basico: data['0'],
              opcao_pelo_simples: data['1'],
              data_opcao_simples: data['2'] || null,
              data_exclusao_simples: data['3'] || null,
              opcao_mei: data['4'],
              data_opcao_mei: data['5'] || null,
              data_exclusao_mei: data['6'] || null
            }
            break

          case 'cnae':
            transformed = {
              codigo: data['0'],
              descricao: data['1']
            }
            break

          case 'moti':
            transformed = {
              codigo: data['0'] !== '' ? parseInt(data['0'], 10) : null,
              descricao: data['1']
            }
            break

          case 'munic':
            transformed = {
              codigo: data['0'] !== '' ? parseInt(data['0'], 10) : null,
              descricao: data['1']
            }
            break

          case 'natju':
            transformed = {
              codigo: data['0'] !== '' ? parseInt(data['0'], 10) : null,
              descricao: data['1']
            }
            break

          case 'pais':
            transformed = {
              codigo: data['0'] !== '' ? parseInt(data['0'], 10) : null,
              descricao: data['1']
            }
            break

          case 'quals':
            transformed = {
              codigo: data['0'] !== '' ? parseInt(data['0'], 10) : null,
              descricao: data['1']
            }
            break

          default:
            break
        }

        results.push(transformed)
      })
      .on('end', async () => {
        try {
          await insertData(client, results, category)
          resolve()
        } catch (error) {
          reject(error)
        }
      })
      .on('error', (error) => {
        console.error(`Error processing file "${filePath}":`, error.message)
        reject(error)
      })
  })
}

/**
 * Processes all files in a category.
 * @param {object} client - The PostgreSQL client.
 * @param {Array} files - Array of file names.
 * @param {string} category - The data category.
 * @param {string} extractedDir - Directory where files are extracted.
 */
async function processCategory (client, files, category, extractedDir) {
  await createTable(client, category)

  for (const file of files) {
    const filePath = path.join(extractedDir, file)
    console.log(`Processing file: "${file}" for category: "${category}"`)
    try {
      await processFile(client, filePath, category)
    } catch (error) {
      console.error(`Failed to process file "${file}":`, error.message)
    }
  }
}

export default { connectDB, processCategory }
