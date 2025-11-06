import fs from "fs";
import { BigQuery } from "@google-cloud/bigquery";

const PROJECT_ID = process.env.PROJECT_ID;
const DATASET_ID = process.env.DATASET_ID;
const TABLE_ID = process.env.TABLE_ID;
const SERVICE_ACCOUNT_KEY = process.env.SERVICE_ACCOUNT_KEY;

const bigquery = new BigQuery({
  projectId: PROJECT_ID,
  keyFilename: SERVICE_ACCOUNT_KEY,
});

export async function insertToBigQueryBatch(row) {
  const dataset = bigquery.dataset(DATASET_ID);
  const table = dataset.table(TABLE_ID);
  const filePath = `./tmp/gtmetrix_result_${row.report_id}.json`;

  fs.mkdirSync("./tmp", { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(row) + "\n");

  await table.load(filePath, {
    sourceFormat: "NEWLINE_DELIMITED_JSON",
    autodetect: false,
    writeDisposition: "WRITE_APPEND",
  });

  console.log("✅ Data loaded to BigQuery:", row.url);
}
