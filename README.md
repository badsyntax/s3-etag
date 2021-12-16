# S3 ETAG

[![Build, Test & Publish](https://github.com/badsyntax/s3-etag/actions/workflows/build-test-publish.yml/badge.svg)](https://github.com/badsyntax/s3-etag/actions/workflows/build-test-publish.yml)
[![CodeQL](https://github.com/badsyntax/s3-etag/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/badsyntax/s3-etag/actions/workflows/codeql-analysis.yml)

Generate an accurate S3 ETAG for any file (including multipart).

## Installation

```console
npm install s3-etag
```

(TypeScript type definitions are included in the package.)

## Usage

```ts
import { generateETag } from 's3-etag';

const etag = generateETag(absoluteFilePath);

expect(etag).toBe('ba0b9fe20dc67b0e4c478ab3c03dc5ce');
```

## License

See [LICENSE.md](./LICENSE.md).
