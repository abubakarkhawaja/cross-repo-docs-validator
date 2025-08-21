import { extractPdfPathsFromManifest } from './pdf-extractor.js';

describe('extractPdfPathsFromManifest', () => {
  it('should return an empty array when no PDFs are present', () => {
    const manifest = {
      name: 'test',
      files: ['a.txt', 'b.doc']
    };
    expect(() => extractPdfPathsFromManifest(manifest)).toThrow(
      'Manifest does not contain any PDF file paths'
    );
  });

  it('should extract PDF paths from a simple manifest', () => {
    const manifest = {
      doc1: 'path/to/file1.pdf',
      doc2: 'path/to/file2.pdf'
    };
    expect(extractPdfPathsFromManifest(manifest)).toEqual(
      ['path/to/file1.pdf', 'path/to/file2.pdf'].sort()
    );
  });

  it('should extract PDF paths from a nested manifest', () => {
    const manifest = {
      section1: {
        doc1: 'path/to/file1.pdf'
      },
      section2: ['path/to/file2.pdf']
    };
    expect(extractPdfPathsFromManifest(manifest)).toEqual(
      ['path/to/file1.pdf', 'path/to/file2.pdf'].sort()
    );
  });

  it('should handle duplicate PDF paths', () => {
    const manifest = {
      doc1: 'path/to/file1.pdf',
      doc2: 'path/to/file1.pdf'
    };
    expect(extractPdfPathsFromManifest(manifest)).toEqual([
      'path/to/file1.pdf'
    ]);
  });

  it('should throw an error when no PDFs are present', () => {
    const manifest = {};
    expect(() => extractPdfPathsFromManifest(manifest)).toThrow(
      'Manifest does not contain any PDF file paths'
    );
  });

  it('should ignore non-string values', () => {
    const manifest = {
      doc1: 'path/to/file1.pdf',
      num: 123,
      bool: true
    };
    expect(extractPdfPathsFromManifest(manifest)).toEqual([
      'path/to/file1.pdf'
    ]);
  });

  it('should handle null and undefined values', () => {
    const manifest = {
      doc1: 'path/to/file1.pdf',
      nullVal: null,
      undefinedVal: undefined
    };
    expect(extractPdfPathsFromManifest(manifest)).toEqual([
      'path/to/file1.pdf'
    ]);
  });
});
