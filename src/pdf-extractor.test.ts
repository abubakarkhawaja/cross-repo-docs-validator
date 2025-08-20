import { extractPdfPathsFromManifest } from './pdf-extractor';

describe('extractPdfPathsFromManifest', () => {
  it('should return an empty array when the manifest is empty', () => {
    const manifest = {};
    const result = extractPdfPathsFromManifest(manifest);
    expect(result).toEqual([]);
  });

  it('should find PDF paths at the root level', () => {
    const manifest = {
      a: 'a.pdf',
      b: 'b.pdf',
    };
    const result = extractPdfPathsFromManifest(manifest);
    expect(result).toEqual(['a.pdf', 'b.pdf']);
  });

  it('should find PDF paths in nested objects', () => {
    const manifest = {
      a: {
        b: {
          c: 'c.pdf',
        },
      },
    };
    const result = extractPdfPathsFromManifest(manifest);
    expect(result).toEqual(['c.pdf']);
  });

  it('should find PDF paths in arrays', () => {
    const manifest = {
      a: ['a.pdf', 'b.pdf'],
    };
    const result = extractPdfPathsFromManifest(manifest);
    expect(result).toEqual(['a.pdf', 'b.pdf']);
  });

  it('should find PDF paths in mixed arrays', () => {
    const manifest = {
      a: ['a.pdf', { b: 'b.pdf' }],
    };
    const result = extractPdfPathsFromManifest(manifest);
    expect(result).toEqual(['a.pdf', 'b.pdf']);
  });

  it('should return unique PDF paths', () => {
    const manifest = {
      a: 'a.pdf',
      b: 'a.pdf',
    };
    const result = extractPdfPathsFromManifest(manifest);
    expect(result).toEqual(['a.pdf']);
  });

  it('should return sorted PDF paths', () => {
    const manifest = {
      b: 'b.pdf',
      a: 'a.pdf',
    };
    const result = extractPdfPathsFromManifest(manifest);
    expect(result).toEqual(['a.pdf', 'b.pdf']);
  });
});
