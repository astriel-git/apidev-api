import pkg from 'pg';
import fs from 'fs';
import readline from 'readline';
import { pipeline, Transform, TransformCallback } from 'stream';
import { promisify } from 'util';
import { parse } from 'csv-parse';
import { from as copyFrom } from 'pg-copy-streams';
import cliProgress from 'cli-progress';
import path from 'path';

const { Client } = pkg;
const pipelineAsync = promisify(pipeline);

/**
 * Counts the number of lines in a file.
 * @param filePath - Path to the file.
 * @returns A promise that resolves to the number of lines.
 */
async function getFileLineCount(filePath: string): Promise<number> {
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  let lineCount = 0;
  for await (const line of rl) {
    lineCount++;
  }
  return lineCount;
}

/**
 * Copies CSV data into the "estabelecimentos" table using PostgreSQL COPY.
 * @param client - The PostgreSQL client.
 * @param csvFilePath - Path to the CSV file.
 * @param progressBar - A cli-progress SingleBar instance.
 */
async function copyCSVToTable(
  client: InstanceType<typeof Client>,
  csvFilePath: string,
  progressBar: cliProgress.SingleBar
): Promise<void> {
  const fileStream = fs.createReadStream(csvFilePath);
  const parser = parse({
    delimiter: ';',
    quote: '"',
    escape: '"',
    from_line: 1,
    trim: true,
  });

  // Define maximum lengths for each column (order matters)
  const maxLengths: Record<string, number> = {
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
    dataSituacaoEspecial: 27,
  };

  const transformStream = new Transform({
    writableObjectMode: true,
    transform(chunk: any, encoding: BufferEncoding, callback: TransformCallback) {
      try {
        // Map each value in the row
        const row = chunk.map((value: string, index: number) => {
          // Trim the value
          value = value.trim();

          // Remove any invalid characters and replace " and ; with single quotes
          value = value
            .replace(/[^a-zA-Z0-9@., "';]/g, '')
            .replace(/[";]/g, "'");

          // If the value is empty or undefined, mark as NULL for COPY
          if (!value) {
            return '\\N';
          }

          // Truncate value to the max allowed length based on column order
          const maxLength = Object.values(maxLengths)[index];
          if (value.length > maxLength) {
            value = value.substring(0, maxLength);
          }
          return value;
        }).join(';') + '\n';

        callback(null, row);
        progressBar.increment();
      } catch (error) {
        callback(error as Error);
      }
    },
  });

  const copyStream = client.query(
    copyFrom(
      'COPY estabelecimentos ("cnpjBasico", "cnpjOrdem", "cnpjDv", "identificadorMatrizFilial", "nomeFantasia", "situacaoCadastral", "dataSituacaoCadastral", "motivoSituacaoCadastral", "nomeCidadeExterior", "pais", "dataInicioAtividade", "cnaeFiscalPrincipal", "cnaeFiscalSecundaria", "tipoLogradouro", "logradouro", "numero", "complemento", "bairro", "cep", "uf", "municipio", "ddd1", "telefone1", "ddd2", "telefone2", "dddFax", "fax", "correioEletronico", "situacaoEspecial", "dataSituacaoEspecial") FROM STDIN WITH CSV DELIMITER \';\' QUOTE \'"\' ESCAPE \'"\' NULL \'\\N\''
    )
  );

  try {
    await pipelineAsync(fileStream, parser, transformStream, copyStream);
  } catch (error) {
    console.error('Error during the COPY operation:', error);
    throw error;
  }
}

/**
 * Main function to process multiple CSV files and load data into the database.
 */
async function main(): Promise<void> {
  const client = new Client({
    user: 'postgres',
    host: '177.136.77.200',
    database: 'apiconsultas',
    password: '44c1561a333189117983c5e060ce723a',
    port: 27815,
  });

  try {
    await client.connect();
    console.log('Connected to the database.');

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
      '../../unzipper/unzipped/Estabelecimentos/K3241.K03200Y9.D40713.ESTABELE',
    ];

    const multiBar = new cliProgress.MultiBar(
      {
        clearOnComplete: false,
        hideCursor: true,
        format: ' {bar} | {percentage}% | {value}/{total} | {filename}',
      },
      cliProgress.Presets.shades_classic
    );

    for (const csvFilePath of csvFiles) {
      const filename = path.basename(csvFilePath);
      const totalLines = await getFileLineCount(csvFilePath);
      const progressBar = multiBar.create(totalLines, 0, { filename });

      try {
        await copyCSVToTable(client, csvFilePath, progressBar);
      } catch (error) {
        console.error(`Error processing ${filename}:`, error);
      }
      progressBar.stop();
    }
    multiBar.stop();

    console.log('All CSV files loaded successfully.');
  } catch (error) {
    console.error('Error connecting to the database or during the COPY operation:', error);
  } finally {
    try {
      await client.end();
      console.log('Disconnected from the database.');
    } catch (error) {
      console.error('Error during disconnection:', error);
    }
  }
}

main().catch(console.error);
