import { promises as fs } from "fs";
import * as path from "path";

export async function checkFileExists(doc) {
  const filePath = validateDocPath(doc);
  if (!filePath) return doc;

  try {
    await fs.access(filePath);
    console.log(`✅ File exists: ${doc}`);
    return null;
  } catch {
    console.error(`❌ File missing: ${doc}`);
    return doc;
  }
}

function validateDocPath(doc) {
  if (!doc.toLowerCase().endsWith(".pdf")) {
    console.warn(`⚠️ Skipping non-PDF entry: ${doc}`);
    return null;
  }

  const filePath = path.join(process.cwd(), doc);
  return filePath;
}
