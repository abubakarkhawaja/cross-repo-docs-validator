import axios from 'axios';
import { promises as fs } from 'fs';
import * as path from 'path';
import { extractPdfPathsFromManifest } from './pdf-extractor';

async function run(): Promise<void> {
  try {
    const manifestUrl = process.env.MANIFEST_URL;
    const token = process.env.DOCS_REPO_PAT;

    if (!manifestUrl || !token) {
      console.error('Missing MANIFEST_URL or DOCS_REPO_PAT environment variables');
      process.exit(1);
    }

    console.log(`Fetching manifest from: ${manifestUrl}`);

    const response = await axios.get(manifestUrl, {
      headers: { 
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3.raw'
      }
    });
    const manifest = response.data;

    const requiredDocs = extractPdfPathsFromManifest(manifest);

    if (requiredDocs.length === 0) {
      console.log('No PDF documents are listed in the manifest. Nothing to check.');
      return;
    }

    console.log(`Found ${requiredDocs.length} required PDF documents in manifest.`);

    const missingDocs: string[] = [];

    for (const doc of requiredDocs) {
      try {
        const filePath = path.join(process.cwd(), doc);
        await fs.access(filePath);
        console.log(`✅ Found required document: ${doc}`);
      } catch {
        console.warn(`❌ Missing required document: ${doc}`);
        missingDocs.push(doc);
      }
    }

    if (missingDocs.length > 0) {
      console.error(`Action failed. The following ${missingDocs.length} required documents were not found: ${missingDocs.join(', ')}`);
      process.exit(1);
    } else {
      console.log('🎉 All required PDF documents are present.');
    }

  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`Failed to fetch manifest file: ${error.message}. Please check the repository and path.`);
    } else if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error('An unknown error occurred.');
    }
    process.exit(1);
  }
}

run();
