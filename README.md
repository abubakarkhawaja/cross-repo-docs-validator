# Docs Manifest Validator Script

This script validates that all PDF documents specified in a remote JSON manifest file exist in the current repository.

## How it Works

The script fetches a JSON manifest file from a specified URL. It then recursively searches through the manifest to find all values that end with `.pdf`. Finally, it checks for the existence of each of these PDF files in the local repository and exits with an error if any are missing.

## Usage

To use this script, you need to set the following environment variables:

- `MANIFEST_URL`: The full raw URL to the `docs-manifest.json` file (e.g., `https://raw.githubusercontent.com/owner/repo/main/docs-manifest.json`).
- `DOCS_REPO_PAT`: A Personal Access Token (PAT) with permission to read the source repository where the manifest file is located.

Then, you can run the script from the command line:

```bash
npm install
npm run build
node dist/index.js
```

### Example Manifest File

The script is designed to work with any JSON file, recursively finding all values that end in `.pdf`. Here is an example of a valid manifest file:

```json
{
  "document_templates": {
    "covers": [
      "shared/doc_template_cover.pdf"
    ],
    "forms": {
      "group_a": "shared/form_template_a.pdf",
      "group_b": "shared/form_template_b.pdf",
      "group_c": "shared/form_template_c.pdf"
    }
  }
}
```

## Development

To build the script, you need to run the following command:

```bash
npm run build
```

This will compile the TypeScript files into the `dist` directory.

To run the tests, use:

```bash
npm test
```