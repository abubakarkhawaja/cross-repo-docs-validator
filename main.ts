import { readFile } from "fs/promises";

const manifestPath: string = 'docs-manifest.json';
const filePaths: Set<string> = new Set();

function findFileNames(node: object): void {
  if (Array.isArray(node)) {
    if (node.every((item): item is string => typeof item === 'string' && item.endsWith('.pdf'))) {
      node.forEach(file => filePaths.add(file));
    } else {
      node.forEach(item => findFileNames(item));
    }
    return;
  }

  if (typeof node === 'object' && node !== null) {
    Object.values(node).forEach(value => findFileNames(value));
  }
}

async function extractPdfPaths(): Promise<void> {
  try {
    const data: string = await readFile(manifestPath, 'utf8');
    const manifest: object = JSON.parse(data);

    findFileNames(manifest);

    const sortedFiles: string[] = Array.from(filePaths).sort();

    if (sortedFiles.length === 0) {
      console.log("No PDF files found in the manifest.");
    } else {
      console.log(`Found ${sortedFiles.length} unique PDF files:`);
      sortedFiles.forEach(file => console.log(file));
    }

  } catch (err) {
    if (err instanceof Error) {
      if ('code' in err && err.code === 'ENOENT') {
        console.error(`❌ Manifest file not found: ${manifestPath}`);
      } else if (err instanceof SyntaxError) {
        console.error('❌ Error parsing JSON from the manifest file:', err.message);
      } else {
        console.error("❌ Error reading the manifest file:", err.message);
      }
    } else {
      console.error("❌ Unknown error:", err);
    }
  }
}

extractPdfPaths();