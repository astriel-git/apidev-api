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
 * Copies CSV data into the "municipios" table using PostgreSQL COPY.
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

  const maxLengths: Record<string, number> = {
    codigo: 6,
    descricao: 100,
  };

  const transformStream = new Transform({
    writableObjectMode: true,
    transform(chunk: any, encoding: BufferEncoding, callback: TransformCallback) {
      try {
        const row = chunk.map((value: string, index: number) => {
          // Trim the value
          value = value.trim();

          // Handle nested quotes: remove extra double quotes if they wrap the value.
          if (value.startsWith('"') && value.endsWith('"')) {
            let insideQuote = false;
            value = value
              .split('')
              .filter((char, i, arr) => {
                if (char === '"') {
                  insideQuote = !insideQuote;
                  // Keep the first and last quotes.
                  if (i === 0 || i === arr.length - 1) return true;
                  return !insideQuote;
                }
                return true;
              })
              .join('');
          }

          // For demonstration: remove inner quotes for a specific field if needed.
          // (Adjust index if needed – here an example is provided for index 1)
          if (index === 1) {
            const firstQuote = value.indexOf('"');
            const lastQuote = value.lastIndexOf('"');
            if (firstQuote !== -1 && lastQuote !== -1 && firstQuote !== lastQuote) {
              const innerValue = value.slice(firstQuote + 1, lastQuote);
              value = value.slice(0, firstQuote + 1) + innerValue.replace(/"/g, '') + value.slice(lastQuote);
            }
          }

          // Handle empty or undefined values
          if (!value) {
            return '\\N';
          }

          // Truncate value to the max allowed length based on column order.
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
      'COPY municipios ("codigo", "descricao") FROM STDIN WITH CSV DELIMITER \';\' QUOTE \'"\' ESCAPE \'"\' NULL \'\\N\''
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
      '../../unzipper/unzipped/Municipios/F.K03200$Z.D40713.MUNICCSV'
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
