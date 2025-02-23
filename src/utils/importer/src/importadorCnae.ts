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
 * Reads a file and returns the number of lines.
 * @param filePath - Path to the file.
 * @returns The number of lines in the file.
 */
async function getFileLineCount(filePath: string): Promise<number> {
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  let lineCount = 0;
  for await (const _line of rl) { // eslint-disable-line no-unused-vars
    lineCount++;
  }
  return lineCount;
}

/**
 * Copies CSV data into the "cnae" table using PostgreSQL COPY.
 * @param client - The PostgreSQL client.
 * @param csvFilePath - The path to the CSV file.
 * @param progressBar - A cli-progress SingleBar instance.
 */
async function copyCSVToTable(
  client: any,
  csvFilePath: string,
  progressBar: cliProgress.SingleBar
): Promise<void> {
  // Create a readable stream with proper encoding conversion
  const fileStream = fs.createReadStream(csvFilePath).pipe(iconv.decodeStream('windows-1252'));
  const parser = parse({
    delimiter: ';',
    quote: '"',
    escape: '"',
    from_line: 1,
    trim: true,
    skip_empty_lines: true,
  });

  // Transform each CSV row to a properly formatted string for COPY
  const transformStream = new Transform({
    writableObjectMode: true,
    transform(chunk: any, encoding: BufferEncoding, callback: TransformCallback) {
      // Ensure row length matches expected columns (2 in this case)
      if (chunk.length !== 2) {
        console.error(`Unexpected row length: ${chunk.length}`);
        return callback(); // Skip invalid rows
      }

      // Replace semicolons with commas in the description field if present
      if (chunk[1]) {
        chunk[1] = chunk[1].replace(/;/g, ',');
      }

      // Join the row values with semicolons and add a newline
      const row = chunk.map((value: any) => value.toString()).join(';') + '\n';
      callback(null, row);
      progressBar.increment();
    },
  });

  // Create a COPY stream query using pg-copy-streams
  const copyStream = client.query(
    copyFrom(
      'COPY cnae (codigo, descricao) FROM STDIN WITH CSV DELIMITER \';\' QUOTE \'"\' ESCAPE \'"\' NULL \'\\N\''
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
 * Main function to connect to the database, load a CSV file, and copy its data.
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

    // Construct the CSV file path (adjust if necessary)
    const csvFilePath = path.join(__dirname, '../../unzipper/unzipped/Cnaes/F.K03200$Z.D40713.CNAECSV');
    const filename = path.basename(csvFilePath);
    const totalLines = await getFileLineCount(csvFilePath);

    const progressBar = new cliProgress.SingleBar(
      {
        format: ' {bar} | {percentage}% | {value}/{total} | {filename}',
        hideCursor: true,
      },
      cliProgress.Presets.shades_classic
    );

    progressBar.start(totalLines, 0, { filename });

    try {
      await copyCSVToTable(client, csvFilePath, progressBar);
    } catch (error) {
      console.error(`Error processing ${filename}:`, error);
    }

    progressBar.stop();
    console.log('CSV file loaded successfully.');
  } catch (error) {
    console.error('Error connecting to the database or during the COPY operation:', error);
  } finally {
    await client.end();
    console.log('Disconnected from the database.');
  }
}

main().catch(console.error);
