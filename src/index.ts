import * as core from '@actions/core';
import axios from 'axios';
import { promises as fs } from 'fs';
import * as path from 'path';
import { extractPdfPathsFromManifest } from './pdf-extractor';

async function run(): Promise<void> {
  try {
    const manifestUrl = core.getInput('manifest-url', { required: true });
    const token = core.getInput('token', { required: true });

    core.info(`Fetching manifest from: ${manifestUrl}`);

    const response = await axios.get(manifestUrl, {
      headers: { 
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3.raw'
      }
    });
    const manifest = response.data;

    const requiredDocs = extractPdfPathsFromManifest(manifest);

    if (requiredDocs.length === 0) {
      core.info('No PDF documents are listed in the manifest. Nothing to check.');
      return;
    }

    core.info(`Found ${requiredDocs.length} required PDF documents in manifest.`);

    const missingDocs: string[] = [];

    for (const doc of requiredDocs) {
      try {
        const filePath = path.join(process.cwd(), doc);
        await fs.access(filePath);
        core.info(`✅ Found required document: ${doc}`);
      } catch {
        core.warning(`❌ Missing required document: ${doc}`);
        missingDocs.push(doc);
      }
    }

    if (missingDocs.length > 0) {
      core.setFailed(`Action failed. The following ${missingDocs.length} required documents were not found: ${missingDocs.join(', ')}`);
    } else {
      core.info('🎉 All required PDF documents are present.');
    }

  } catch (error) {
    if (axios.isAxiosError(error)) {
      core.setFailed(`Failed to fetch manifest file: ${error.message}. Please check the repository and path.`);
    } else if (error instanceof Error) {
      core.setFailed(error.message);
    } else {
      core.setFailed('An unknown error occurred.');
    }
  }
}

run();
