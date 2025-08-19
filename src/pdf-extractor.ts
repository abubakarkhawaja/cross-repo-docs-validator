
/**
 * Recursively finds all values ending in '.pdf' from a JSON object.
 * @param node The JSON object or array to search.
 * @param filePaths A Set to store the found PDF file paths.
 */
function findFileNames(node: any, filePaths: Set<string>): void {
  if (typeof node === 'string' && node.endsWith('.pdf')) {
    filePaths.add(node);
    return;
  }

  if (Array.isArray(node)) {
    node.forEach(item => findFileNames(item, filePaths));
    return;
  }

  if (typeof node === 'object' && node !== null) {
    Object.values(node).forEach(value => findFileNames(value, filePaths));
  }
}

/**
 * Extracts all unique PDF file paths from a JSON manifest object.
 * @param manifest The parsed JSON manifest object.
 * @returns A sorted array of unique PDF file paths.
 */
export function extractPdfPathsFromManifest(manifest: object): string[] {
  const filePaths = new Set<string>();
  findFileNames(manifest, filePaths);
  return Array.from(filePaths).sort();
}
