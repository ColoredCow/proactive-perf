import "dotenv/config";
import { URLS_TO_TEST } from "./config/urls.js";
import { startTest, waitForReport, extractMetrics } from "./services/gtmetrix.js";
import { insertToBigQueryBatch } from "./services/bigquery.js";

(async () => {
  console.log(`🚀 Starting GTMetrix batch for ${URLS_TO_TEST.length} URLs\n`);

  for (const { label, url } of URLS_TO_TEST) {
    console.log(`🌐 [${label}] Testing ${url}`);

    try {
      const testId = await startTest(url);
      console.log("🧪 Test started:", testId);

      const report = await waitForReport(testId);
      if (report.error) {
        console.warn(`⚠️ Skipping BigQuery insert for ${url} — test failed at GTmetrix.`);
        continue;
      }

      const row = extractMetrics(report);

      row.page_name = label;
      console.table(row);
      await insertToBigQueryBatch(row);
    } catch (err) {
      console.error(`❌ Failed for ${label}:`, err.message);
    }

    console.log("\n------------------------------------\n");
    await new Promise(r => setTimeout(r, 15000));
  }

  console.log("🎯 All URLs processed!");
})();
