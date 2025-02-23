import pkg from 'pg';
import fs from 'fs';
import readline from 'readline';
import { pipeline, Transform, TransformCallback } from 'stream';
import { promisify } from 'util';
import { parse } from 'csv-parse';
import { from as copyFrom } from 'pg-copy-streams';
import cliProgress from 'cli-progress';
import path from 'path';
import iconv from 'iconv-lite';

const { Client } = pkg;
const pipelineAsync = promisify(pipeline);

/**
 * Counts the number of lines in a file.
 * @param filePath - The path to the file.
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
 * Copies CSV data into the "socios" table using PostgreSQL COPY.
 * @param client - The PostgreSQL client.
 * @param csvFilePath - The path to the CSV file.
 * @param progressBar - A cli-progress SingleBar instance.
 */
async function copyCSVToTable(
  client: InstanceType<typeof Client>,
  csvFilePath: string,
  progressBar: cliProgress.SingleBar
): Promise<void> {
  // Read the CSV file and decode from windows-1252
  const fileStream = fs
    .createReadStream(csvFilePath)
    .pipe(iconv.decodeStream('windows-1252'));
  const parser = parse({
    delimiter: ';',
    quote: '"',
    escape: '"',
    from_line: 1,
    trim: true,
  });

  // Define maximum allowed lengths for each column.
  const maxLengths: Record<string, number> = {
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
    faixaEtaria: 2,
  };

  const transformStream = new Transform({
    writableObjectMode: true,
    transform(chunk: any, encoding: BufferEncoding, callback: TransformCallback) {
      try {
        // Process each field in the row according to its index
        const row = chunk.map((value: string, index: number) => {
          value = value.trim();

          // For fields that require special handling (e.g., removing inner quotes)
          // Here, index 2 corresponds to "nomeSocio" and index 8 to "nomeRepresentante"
          if (index === 2 || index === 8) {
            if (value.startsWith('"') && value.endsWith('"')) {
              // Remove outer quotes and any inner quotes
              value = value.slice(1, -1).replace(/"/g, '');
            }
          }

          // Enforce the maximum length constraint.
          const maxLength = Object.values(maxLengths)[index];
          // If value is falsy (empty string, etc.), return PostgreSQL NULL marker.
          return value ? value.substring(0, maxLength) : '\\N';
        }).join(';') + '\n';

        callback(null, row);
        progressBar.increment();
      } catch (error) {
        callback(error as Error);
      }
    },
  });

  // Build the COPY stream query for the "socios" table.
  const copyStream = client.query(
    copyFrom(
      'COPY socios ("cnpjBasico", "identificadorSocio", "nomeSocio", "cnpjCpfSocio", "qualificacaoSocio", "dataEntradaSociedade", "pais", "representanteLegal", "nomeRepresentante", "qualificacaoRepresentante", "faixaEtaria") FROM STDIN WITH CSV DELIMITER \';\' QUOTE \'"\' ESCAPE \'\\\' NULL \'\\N\''
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
 * Main function to process multiple CSV files and load data into the "socios" table.
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
      '../../unzipper/unzipped/Socios/K3241.K03200Y0.D40713.SOCIOCSV',
      '../../unzipper/unzipped/Socios/K3241.K03200Y1.D40713.SOCIOCSV',
      '../../unzipper/unzipped/Socios/K3241.K03200Y2.D40713.SOCIOCSV',
      '../../unzipper/unzipped/Socios/K3241.K03200Y3.D40713.SOCIOCSV',
      '../../unzipper/unzipped/Socios/K3241.K03200Y4.D40713.SOCIOCSV',
      '../../unzipper/unzipped/Socios/K3241.K03200Y5.D40713.SOCIOCSV',
      '../../unzipper/unzipped/Socios/K3241.K03200Y6.D40713.SOCIOCSV',
      '../../unzipper/unzipped/Socios/K3241.K03200Y7.D40713.SOCIOCSV',
      '../../unzipper/unzipped/Socios/K3241.K03200Y8.D40713.SOCIOCSV',
      '../../unzipper/unzipped/Socios/K3241.K03200Y9.D40713.SOCIOCSV',
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
