import path from 'node:path';
import url from 'node:url';
import { describe, it, expect } from '@jest/globals';
import { generateETag } from '../s3Etag.js';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const stylesFilePath = path.resolve(__dirname, 'fixtures', 'styles.css');

describe('s3ETag', () => {
  it('should generate an etag for a non-multipart upload file', () => {
    const etag = generateETag(stylesFilePath);
    expect(etag).toBe('ba0b9fe20dc67b0e4c478ab3c03dc5ce');
  });

  it('should generate an etag for a multipart upload file', () => {
    const etag = generateETag(stylesFilePath, 10);
    expect(etag).toBe('b8ffa274b982363604db211ee8ffb991-3');
  });
});
