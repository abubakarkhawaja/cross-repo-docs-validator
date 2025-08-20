import * as core from '@actions/core';
import * as github from '@actions/github';
import { extractPdfPathsFromManifest } from './pdf-extractor';

async function run(): Promise<void> {
  try {
    const manifestUrl = core.getInput('manifest-url', { required: true });
    const token = core.getInput('token', { required: true });
    const repoUrl = core.getInput('repo-url', { required: true });

    const urlParts = repoUrl.split('/');
    const owner = urlParts[urlParts.length - 2];
    const repo = urlParts[urlParts.length - 1];

    core.info(`Fetching manifest from: ${manifestUrl}`);

    const octokit = github.getOctokit(token);

    const manifestUrlParts = new URL(manifestUrl).pathname.split('/');
    const manifestOwner = manifestUrlParts[2];
    const manifestRepo = manifestUrlParts[3];
    const manifestPath = manifestUrlParts.slice(5).join('/');

    const { data: manifestData } = await octokit.rest.repos.getContent({
      owner: manifestOwner,
      repo: manifestRepo,
      path: manifestPath,
    });

    if (!('content' in manifestData) || !manifestData.content) {
      throw new Error('Manifest file content not found or is empty.');
    }

    const manifestString = Buffer.from(manifestData.content, 'base64').toString('utf-8');
    const manifest = JSON.parse(manifestString);

    const requiredDocs = extractPdfPathsFromManifest(manifest);

    if (requiredDocs.length === 0) {
      core.info('No PDF documents are listed in the manifest. Nothing to check.');
      return;
    }

    core.info(`Found ${requiredDocs.length} required PDF documents in manifest.`);

    const missingDocs: string[] = [];

    for (const doc of requiredDocs) {
      try {
        await octokit.rest.repos.getContent({
          owner,
          repo,
          path: doc,
        });
        core.info(`✅ Found required document: ${doc}`);
      } catch (error) {
        if (error && typeof error === 'object' && 'status' in error && error.status === 404) {
          core.warning(`❌ Missing required document: ${doc}`);
          missingDocs.push(doc);
        } else {
          throw error;
        }
      }
    }

    if (missingDocs.length > 0) {
      core.setFailed(`Action failed. The following ${missingDocs.length} required documents were not found: ${missingDocs.join(', ')}`);
    } else {
      core.info('🎉 All required PDF documents are present.');
    }

  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    } else {
      core.setFailed('An unknown error occurred.');
    }
  }
}

run();