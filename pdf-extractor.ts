
/**
 * Recursively finds all values ending in '.pdf' from a JSON object.
 * @param node The JSON object or array to search.
 * @param filePaths A Set to store the found PDF file paths.
 */
function findFileNames(node: object, filePaths: Set<string>): void {
  if (Array.isArray(node)) {
    // If all items are strings ending in .pdf, add them to the set
    if (node.every((item): item is string => typeof item === 'string' && item.endsWith('.pdf'))) {
      node.forEach(file => filePaths.add(file));
    } else {
      // Otherwise, recurse into each item
      node.forEach(item => findFileNames(item, filePaths));
    }
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
