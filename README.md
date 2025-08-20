# Docs Manifest Validator Action

This GitHub Action validates that all PDF documents specified in a remote JSON manifest file exist in a *specified remote GitHub repository*.

## How it Works

The action fetches a JSON manifest file from a specified URL. It then recursively searches through the manifest to find all values that end with `.pdf`. Finally, it uses the GitHub API to check for the existence of each of these PDF files in the specified remote repository and fails the action if any are missing.

## Usage

To use this action, you need to add a step to your workflow file (e.g., `.github/workflows/ci.yml`) that uses this action.

```yaml
name: 'Docs Validator CI'

on: [push]

jobs:
  test_action:
    runs-on: ubuntu-latest
    steps:
      - name: 'Checkout code'
        uses: actions/checkout@v4

      - name: 'Run the action'
        uses: ./
        with:
          manifest-url: ${{ secrets.MANIFEST_URL }}
          token: ${{ secrets.DOCS_REPO_PAT }}
          repo-url: ${{ secrets.REPO_URL }}
```

### Inputs

- `manifest-url` (required): The full raw URL to the `docs-manifest.json` file (e.g., `https://raw.githubusercontent.com/owner/repo/main/docs-manifest.json`).
- `token` (required): A Personal Access Token (PAT) with permission to read the source repository where the manifest file is located, and the `repo-url`.
- `repo-url` (required): The URL of the GitHub repository to check for the existence of documents (e.g., `https://github.com/owner/repo-to-check`).

### Example Manifest File

The action is designed to work with any JSON file, recursively finding all values that end in `.pdf`. Here is an example of a valid manifest file:

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

To build the action, you need to run the following commands:

```bash
npm install
npm run package
```

This will install the dependencies and package the action into a single file in the `dist` directory.

To run the tests, use:

```bash
npm test
```