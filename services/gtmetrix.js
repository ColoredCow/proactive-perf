import fetch from "node-fetch";

const GT_API_KEY = process.env.GT_API_KEY;

export async function startTest(url) {
  const body = {
    data: { type: "test", attributes: { url } },
  };

  const resp = await fetch("https://gtmetrix.com/api/2.0/tests", {
    method: "POST",
    headers: {
      Authorization: "Basic " + Buffer.from(GT_API_KEY + ":").toString("base64"),
      "Content-Type": "application/vnd.api+json",
    },
    body: JSON.stringify(body),
  });

  const data = await resp.json();
  if (!resp.ok) {
    console.error("❌ GTMetrix API Error:", JSON.stringify(data, null, 2));
    throw new Error(`GTMetrix API failed: ${data.errors?.[0]?.title || resp.statusText}`);
  }

  return data.data.id;
}

export async function waitForReport(testId) {
  for (let i = 0; i < 25; i++) {
    const resp = await fetch(`https://gtmetrix.com/api/2.0/tests/${testId}`, {
      headers: {
        Authorization: "Basic " + Buffer.from(GT_API_KEY + ":").toString("base64"),
      },
    });

    const data = await resp.json();
    const attrs = data?.data?.attributes || {};
    const type = data?.data?.type;

    // ✅ finished with a valid report
    if (type === "report") {
      console.log("✅ Report ready:", data.data.id);
      return data.data;
    }

    // ✅ finished but errored
    if (attrs.state === "error") {
      console.error(`❌ GTmetrix test ${testId} failed: ${attrs.error}`);
      // return a special object so we can still log the failure in BigQuery if desired
      return { error: true, attributes: attrs };
    }

    console.log(`⏳ Waiting (${i + 1})... current state: ${attrs.state}`);
    await new Promise((r) => setTimeout(r, 10000));
  }

  throw new Error("Test timed out (report not ready)");
}

export function extractMetrics(report) {
  const a = report.attributes;
  return {
    report_id: report.id,
    page_name: new URL(a.url).hostname,
    url: a.url,
    gtmetrix_score: a.gtmetrix_score,
    largest_contentful_paint: a.largest_contentful_paint,
    time_to_first_byte: a.time_to_first_byte,
    cumulative_layout_shift: a.cumulative_layout_shift,
    fully_loaded_time: a.fully_loaded_time,
    performance_score: a.performance_score,
    structure_score: a.structure_score,
    report_grade: a.gtmetrix_grade,
    test_date: new Date().toISOString(),
    report_url: report.links?.report_url,
  };
}
