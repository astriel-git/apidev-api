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
 * Reads a file and returns its line count.
 * @param filePath - Path to the file.
 * @returns A promise that resolves to the number of lines in the file.
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
 * Copies CSV data into the "empresas" table using PostgreSQL COPY.
 * @param client - The PostgreSQL client.
 * @param csvFilePath - The path to the CSV file.
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
    razaoSocial: 255,
    naturezaJuridica: 50,
    qualificacaoResponsavel: 255,
    capitalSocial: 50,
    porteEmpresa: 10,
    enteFederativoResponsavel: 255,
  };

  const transformStream = new Transform({
    writableObjectMode: true,
    readableObjectMode: false,
    transform(chunk: any, encoding: BufferEncoding, callback: TransformCallback) {
      try {
        // Map each column in the row
        const row = chunk.map((value: string, index: number) => {
          // Trim the value and replace extra semicolons and quotes
          value = value.trim().replace(/;+/g, ' ').replace(/"+/g, "'");

          // Identify the column name by its index from the maxLengths keys
          const columnName = Object.keys(maxLengths)[index];
          // Replace empty strings with the NULL marker for our columns
          if (
            columnName === 'cnpjBasico' ||
            columnName === 'razaoSocial' ||
            columnName === 'naturezaJuridica' ||
            columnName === 'qualificacaoResponsavel' ||
            columnName === 'capitalSocial' ||
            columnName === 'porteEmpresa' ||
            columnName === 'enteFederativoResponsavel'
          ) {
            value = value === '' ? '\\N' : value;
          }

          // Truncate value if it exceeds the max length
          const maxLength = Object.values(maxLengths)[index];
          if (value.length > maxLength) {
            value = value.substring(0, maxLength);
          }
          return value;
        });

        // Join the transformed row with semicolons and add newline
        const transformedRow = row.join(';') + '\n';
        callback(null, transformedRow);
        progressBar.increment();
      } catch (error) {
        callback(error as Error);
      }
    },
  });

  const copyStream = client.query(
    copyFrom(
      'COPY empresas ("cnpjBasico", "razaoSocial", "naturezaJuridica", "qualificacaoResponsavel", "capitalSocial", "porteEmpresa", "enteFederativoResponsavel") FROM STDIN WITH CSV DELIMITER \';\' QUOTE \'"\' ESCAPE \'"\' NULL \'\\N\''
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
 * Main function to process CSV files and load data into the database.
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
      '../../unzipper/unzipped/Empresas/K3241.K03200Y0.D40713.EMPRECSV',
      '../../unzipper/unzipped/Empresas/K3241.K03200Y1.D40713.EMPRECSV',
      '../../unzipper/unzipped/Empresas/K3241.K03200Y2.D40713.EMPRECSV',
      '../../unzipper/unzipped/Empresas/K3241.K03200Y3.D40713.EMPRECSV',
      '../../unzipper/unzipped/Empresas/K3241.K03200Y4.D40713.EMPRECSV',
      '../../unzipper/unzipped/Empresas/K3241.K03200Y5.D40713.EMPRECSV',
      '../../unzipper/unzipped/Empresas/K3241.K03200Y6.D40713.EMPRECSV',
      '../../unzipper/unzipped/Empresas/K3241.K03200Y7.D40713.EMPRECSV',
      '../../unzipper/unzipped/Empresas/K3241.K03200Y8.D40713.EMPRECSV',
      '../../unzipper/unzipped/Empresas/K3241.K03200Y9.D40713.EMPRECSV',
    ];

    // Create a multi-bar for progress reporting
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
