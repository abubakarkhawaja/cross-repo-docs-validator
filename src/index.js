import assert from "assert";
import { promises as fs } from "fs";
import * as path from "path";
import { extractPdfPathsFromManifest } from "./pdf-extractor.js";

async function run() {
  const manifestUrl = process.env.MANIFEST_URL;
  const token = process.env.DOCS_REPO_PAT;

  assert.ok(manifestUrl, "Environment variable MANIFEST_URL must be set");
  assert.ok(token, "Environment variable DOCS_REPO_PAT must be set");

  console.log(`Fetching manifest from: ${manifestUrl}`);

  const response = await fetch(manifestUrl, {
    headers: {
      Authorization: `token ${token}`,
      Accept: "application/vnd.github.v3.raw",
    },
  });

  assert.ok(response.ok, `Manifest fetch should succeed (got ${response.status})`);

  const manifest = await response.json();
  const requiredDocs = extractPdfPathsFromManifest(manifest);

  if (requiredDocs.length === 0) {
    console.log("⚠️ No PDF documents are listed in the manifest. Nothing to check.");
    return;
  }

  const missingFiles = [];

  for (const doc of requiredDocs) {
    const filePath = path.join(process.cwd(), doc);
    try {
      await fs.access(filePath);
      console.log(`✅ File exists: ${doc}`);
    } catch {
      console.error(`❌ File missing: ${doc}`);
      missingFiles.push(doc);
    }
  }

  assert.strictEqual(
    missingFiles.length,
    0,
    'Some required PDFs are missing.'
  );

  console.log("🎉 All checks passed");
}

run().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
