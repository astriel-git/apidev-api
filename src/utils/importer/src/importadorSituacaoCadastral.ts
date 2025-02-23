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
  for await (const _line of rl) {
    lineCount++;
  }
  return lineCount;
}

/**
 * Copies CSV data into the "situacaoCadastral" table using PostgreSQL COPY.
 * @param client - The PostgreSQL client.
 * @param csvFilePath - Path to the CSV file.
 * @param progressBar - A cli-progress SingleBar instance.
 */
async function copyCSVToTable(
  client: InstanceType<typeof Client>,
  csvFilePath: string,
  progressBar: cliProgress.SingleBar
): Promise<void> {
  // Directly reading the file without encoding conversion
  const fileStream = fs.createReadStream(csvFilePath);
  const parser = parse({
    delimiter: ';',
    quote: '"',
    escape: '"',
    from_line: 1,
    trim: true,
    skip_empty_lines: true,
  });

  const transformStream = new Transform({
    writableObjectMode: true,
    transform(chunk: any, encoding: BufferEncoding, callback: TransformCallback) {
      // Expecting exactly 2 columns per row
      if (chunk.length !== 2) {
        console.error(`Unexpected row length: ${chunk.length}`);
        return callback(); // Skip invalid rows
      }

      // Replace semicolons in the second column with commas
      if (chunk[1]) {
        chunk[1] = chunk[1].replace(/;/g, ',');
      }

      const row = chunk.map((value: any) => value.toString()).join(';') + '\n';
      callback(null, row);
      progressBar.increment();
    },
  });

  const copyStream = client.query(
    copyFrom(
      'COPY "situacaoCadastral" (codigo, descricao) FROM STDIN WITH CSV DELIMITER \';\' QUOTE \'"\' ESCAPE \'"\' NULL \'\\N\''
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
 * Main function to load CSV data into the database.
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

    const csvFilePath = '../../unzipper/unzipped/DESCMOTIVOSITUACAOCADASTRAL.CSV';
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
    try {
      await client.end();
      console.log('Disconnected from the database.');
    } catch (error) {
      console.error('Error during disconnection:', error);
    }
  }
}

main().catch(console.error);
