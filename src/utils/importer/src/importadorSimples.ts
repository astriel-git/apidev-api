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
 * @returns A promise resolving to the line count.
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
 * Copies CSV data into the "simples" table using PostgreSQL COPY.
 * @param client - The PostgreSQL client.
 * @param csvFilePath - The CSV file path.
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

  // Maximum lengths for each column based on order
  const maxLengths: Record<string, number> = {
    cnpjBasico: 10,
    opcaoPeloSimples: 10,
    dataOpcaoPeloSimples: 10,
    dataExclusaoDoSimples: 10,
    opcaoPeloMei: 10,
    dataOpcaoPeloMei: 10,
    dataExclusaoDoMei: 10,
  };

  const transformStream = new Transform({
    writableObjectMode: true,
    transform(chunk: any, encoding: BufferEncoding, callback: TransformCallback) {
      try {
        const row = chunk.map((value: string, index: number) => {
          // Trim the value
          value = value.trim();

          // Replace all invalid characters: allow letters, numbers, @, ., comma, space, double quotes, and semicolons.
          value = value
            .replace(/[^a-zA-Z0-9@., ";]/g, '')
            .replace(/[";]/g, "'");

          // Replace empty values with PostgreSQL NULL marker
          if (value === undefined || value === '') {
            return '\\N';
          }

          // Truncate the value to its maximum allowed length (by column order)
          const maxLength = Object.values(maxLengths)[index];
          return value.substring(0, maxLength);
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
      'COPY simples ("cnpjBasico", "opcaoPeloSimples", "dataOpcaoPeloSimples", "dataExclusaoDoSimples", "opcaoPeloMei", "dataOpcaoPeloMei", "dataExclusaoDoMei") FROM STDIN WITH CSV DELIMITER \';\' QUOTE \'"\' ESCAPE \'"\' NULL \'\\N\''
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
 * Main function to process CSV files and load data into the "simples" table.
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
      '../../unzipper/unzipped/Simples/F.K03200$W.SIMPLES.CSV.D40713'
    ];

    // Enhanced progress bar using MultiBar
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
