import assert from "assert";

function findFileNames(node, filePaths) {
  if (typeof node === "string" && node.toLowerCase().endsWith(".pdf")) {
    filePaths.add(node);
    return;
  }

  if (Array.isArray(node)) {
    node.forEach((item) => findFileNames(item, filePaths));
    return;
  }

  if (typeof node === "object" && node !== null) {
    Object.values(node).forEach((value) => findFileNames(value, filePaths));
  }
}

export function extractPdfPathsFromManifest(manifest) {
  assert.ok(
    typeof manifest === "object" && manifest !== null,
    "Manifest must be a non-null object or array"
  );

  const filePaths = new Set();
  findFileNames(manifest, filePaths);

  assert.ok(
    filePaths.size > 0,
    "Manifest does not contain any PDF file paths"
  );

  return Array.from(filePaths).sort();
}
