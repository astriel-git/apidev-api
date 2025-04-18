// src/libraries/importer/src/databaseimporter.ts
import fs from 'fs-extra';
import path from 'path';
import csv from 'csv-parser';
import dotenv from 'dotenv';
import pkg from 'pg';
const { Client } = pkg;
import type { Client as ClientType } from 'pg';

dotenv.config();

interface DatabaseConfig {
  connectionString: string;
  maxConnections?: number;
  idleTimeoutMillis?: number;
}

interface ImportProgress {
  total: number;
  processed: number;
  currentFile: string;
  status: 'processing' | 'completed' | 'error';
  error?: string;
}

interface TableSchema {
  [key: string]: {
    columns: string[];
    primaryKey?: string;
    indexes?: string[];
  };
}

const TABLE_SCHEMAS: TableSchema = {
  empresa: {
    columns: [
      'cnpj_basico',
      'razao_social',
      'natureza_juridica',
      'qualificacao_responsavel',
      'capital_social',
      'porte_empresa',
      'ente_federativo_responsavel'
    ],
    primaryKey: 'cnpj_basico'
  },
  estabelecimento: {
    columns: [
      'cnpj_basico',
      'cnpj_ordem',
      'cnpj_dv',
      'identificador_matriz_filial',
      'nome_fantasia',
      'situacao_cadastral',
      'data_situacao_cadastral',
      'motivo_situacao_cadastral',
      'nome_cidade_exterior',
      'pais',
      'data_inicio_atividade',
      'cnae_fiscal_principal',
      'cnae_fiscal_secundaria',
      'tipo_logradouro',
      'logradouro',
      'numero',
      'complemento',
      'bairro',
      'cep',
      'uf',
      'municipio',
      'ddd_1',
      'telefone_1',
      'ddd_2',
      'telefone_2',
      'ddd_fax',
      'fax',
      'correio_eletronico',
      'situacao_especial',
      'data_situacao_especial'
    ],
    indexes: ['cnpj_basico']
  },
  socios: {
    columns: [
      'cnpj_basico',
      'identificador_socio',
      'nome_socio_razao_social',
      'cpf_cnpj_socio',
      'qualificacao_socio',
      'data_entrada_sociedade',
      'pais',
      'representante_legal',
      'nome_do_representante',
      'qualificacao_representante_legal',
      'faixa_etaria'
    ],
    indexes: ['cnpj_basico']
  },
  socios: {
    columns: [
      'cnpj_basico',
      'opcao_pelo_simples',
      'data_opcao_simples',
      'data_exclusao_simples',
      'opcao_mei',
      'data_opcao_mei',
      'data_exclusao_mei'
    ],
    indexes: ['cnpj_basico']
  },
  cnae: {
    columns: [
      'codigo',
      'descricao'
    ],
    indexes: ['codigo']
  },
  moti: {
    columns: [
      'codigo',
      'descricao'
    ],
    indexes: ['codigo']
  },
  munic: {
    columns: [
      'codigo',
      'descricao'
    ],
    indexes: ['codigo']
  },
  natju: {
    columns: [
      'codigo',
      'descricao'
    ],
    indexes: ['codigo']
  },
  pais: {
    columns: [
      'codigo',
      'descricao'
    ],
    indexes: ['codigo']
  },
  quals: {
    columns: [
      'codigo',
      'descricao'
    ],
    indexes: ['codigo']
  },
};

/**
 * Connects to PostgreSQL with improved error handling and configuration
 */
async function connectDB(config: DatabaseConfig = { connectionString: process.env.DATABASE_URL! }): Promise<ClientType> {
  const client = new Client({
    ...config,
    connectionString: config.connectionString,
  });

  try {
    await client.connect();
    console.log('Connected to PostgreSQL database successfully');
    return client;
  } catch (error: any) {
    console.error('Error connecting to PostgreSQL:', {
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    throw new Error(`Database connection failed: ${error.message}`);
  }
}

/**
 * Creates a table based on the category with improved schema handling
 */
async function createTable(client: ClientType, category: string): Promise<void> {
  console.log("This is what vcategory looks like", category);
  const schema = TABLE_SCHEMAS[category];
  if (!schema) {
    throw new Error(`No schema defined for category: ${category}`);
  }

  const columns = schema.columns.map(col => `"${col}" VARCHAR`).join(',\n  ');
  const primaryKey = schema.primaryKey ? `,\n  PRIMARY KEY ("${schema.primaryKey}")` : '';
  const indexes = schema.indexes?.map(idx => `CREATE INDEX IF NOT EXISTS idx_${category}_${idx} ON "${category}" ("${idx}");`).join('\n') || '';

  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS "${category}" (
      ${columns}${primaryKey}
    );
    ${indexes}
  `;

  try {
    await client.query('BEGIN');
    await client.query(createTableQuery);
    await client.query('COMMIT');
    console.log(`Table "${category}" created successfully with indexes`);
  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error(`Error creating table "${category}":`, {
      message: error.message,
      query: createTableQuery
    });
    throw error;
  }
}

/**
 * Inserts data into the specified table with improved error handling and batch processing
 */
async function insertData(
  client: ClientType,
  data: Array<Record<string, any>>,
  tableName: string,
  batchSize: number = 1000
): Promise<void> {
  if (data.length === 0) return;

  console.log('table name', tableName)

  const schema = TABLE_SCHEMAS[tableName];
  if (!schema) {
    throw new Error(`No schema defined for table: ${tableName}`);
  }

  const columns = schema.columns.map(col => `"${col}"`).join(', ');
  
  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize);
    const values: any[] = [];
    const placeholders = batch
      .map((_, rowIndex) => {
        const startIndex = rowIndex * schema.columns.length;
        return `(${schema.columns.map((_, colIndex) => `$${startIndex + colIndex + 1}`).join(', ')})`;
      })
      .join(', ');

    batch.forEach(row => {
      schema.columns.forEach(col => {
        values.push(row[col] ?? null);
      });
    });

    const query = `
      INSERT INTO "${tableName}" (${columns})
      VALUES ${placeholders}
      ON CONFLICT DO NOTHING;
    `;

    try {
      await client.query(query, values);
      console.log(`Inserted ${batch.length} records into "${tableName}" (batch ${i / batchSize + 1})`);
    } catch (error: any) {
      console.error(`Error inserting batch into "${tableName}":`, {
        message: error.message,
        batchSize: batch.length,
        startIndex: i
      });
      throw error;
    }
  }
}

/**
 * Processes and inserts data from a CSV file into the database.
 * @param client - The PostgreSQL client.
 * @param filePath - Path to the CSV file.
 * @param category - The data category.
 */
async function processFile(client: ClientType, filePath: string, category: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const results: any[] = [];
    fs.createReadStream(filePath)
      .pipe(csv({ separator: ';', headers: false }))
      .on('data', (data: any) => {
        let transformed: any = {};

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
            };
            break;

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
            };
            break;

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
            };
            break;

          case 'simples':
            transformed = {
              cnpj_basico: data['0'],
              opcao_pelo_simples: data['1'],
              data_opcao_simples: data['2'] || null,
              data_exclusao_simples: data['3'] || null,
              opcao_mei: data['4'],
              data_opcao_mei: data['5'] || null,
              data_exclusao_mei: data['6'] || null
            };
            break;

          case 'cnae':
            transformed = {
              codigo: data['0'],
              descricao: data['1']
            };
            break;

          case 'moti':
            transformed = {
              codigo: data['0'] !== '' ? parseInt(data['0'], 10) : null,
              descricao: data['1']
            };
            break;

          case 'munic':
            transformed = {
              codigo: data['0'] !== '' ? parseInt(data['0'], 10) : null,
              descricao: data['1']
            };
            break;

          case 'natju':
            transformed = {
              codigo: data['0'] !== '' ? parseInt(data['0'], 10) : null,
              descricao: data['1']
            };
            break;

          case 'pais':
            transformed = {
              codigo: data['0'] !== '' ? parseInt(data['0'], 10) : null,
              descricao: data['1']
            };
            break;

          case 'quals':
            transformed = {
              codigo: data['0'] !== '' ? parseInt(data['0'], 10) : null,
              descricao: data['1']
            };
            break;

          default:
            break;
        }

        results.push(transformed);
        console.log(`Look dude`, category);
      })
      .on('end', async () => {
        try {
          await insertData(client, results, category);
          resolve();
        } catch (error) {
          reject(error);
        }
      })
      .on('error', (error: any) => {
        console.error(`Error processing file "${filePath}":`, error.message);
        reject(error);
      });
  });
}

/**
 * Processes all files in a category.
 * @param client - The PostgreSQL client.
 * @param files - Array of file names.
 * @param category - The data category.
 * @param extractedDir - Directory where files are extracted.
 */
async function processCategory(
  client: ClientType,
  files: string[],
  category: string,
  extractedDir: string
): Promise<void> {
  await createTable(client, category);

  for (const file of files) {
    const filePath = path.join(extractedDir, file);
    console.log(`Processing file: "${file}" for category: "${category}"`);
    try {
      await processFile(client, filePath, category);
    } catch (error: any) {
      console.error(`Failed to process file "${file}":`, error.message);
    }
  }
}

export default { connectDB, processCategory };
