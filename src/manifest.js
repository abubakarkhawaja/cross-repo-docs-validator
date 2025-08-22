import assert from "assert";

import { extractPdfPathsFromManifest } from "./pdf-extractor.js";
import { checkFileExists } from "./utils.js";

export async function processManifest(url, token) {
  const manifest = await fetchManifest(url, token);
  const requiredDocs = extractPdfPathsFromManifest(manifest);

  if (requiredDocs.length === 0) {
    console.warn(`⚠️ No PDFs listed in: ${url}`);
    return [];
  }

  const results = await Promise.all(
    requiredDocs.map((doc) => checkFileExists(doc))
  );

  return results.filter(Boolean);
}

async function fetchManifest(url, token) {
  console.log(`Fetching manifest: ${url}\n`);

  const response = await fetch(url, {
    headers: {
      Authorization: `token ${token}`,
      Accept: "application/vnd.github.v3.raw",
    },
  });

  assert.ok(response.ok, `Manifest fetch failed (${response.status})`);
  return response.json();
}