import "dotenv/config"
import assert from "assert";
import { processManifest } from "./manifest.js";

function getEnvVar(name) {
  const value = process.env[name];
  assert.ok(value, `Environment variable ${name} required`);
  return value;
}

async function main() {
  const manifest_urls = getEnvVar("MANIFEST_URLS");
  const token = getEnvVar("DOCS_REPO_PAT");

  assert.ok(manifest_urls, "Environment variable MANIFEST_URLS required");
  assert.ok(token, "Environment variable DOCS_REPO_PAT required");

  const manifestUrls = manifest_urls.split(",").map((u) => u.trim()).filter(Boolean);

  const manifestResults = await Promise.all(
    manifestUrls.map((url) => processManifest(url, token))
  );

  const missingFilesAcrossManifests = manifestResults.flat();

  assert.strictEqual(
    missingFilesAcrossManifests.length,
    0,
    'Missing PDF files'
  );

  console.log("✅ All checks passed for all manifests 🎉");
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
