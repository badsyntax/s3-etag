# S3 ETAG

[![Build, Test & Publish](https://github.com/badsyntax/s3-etag/actions/workflows/build-test-publish.yml/badge.svg)](https://github.com/badsyntax/s3-etag/actions/workflows/build-test-publish.yml)
[![CodeQL](https://github.com/badsyntax/s3-etag/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/badsyntax/s3-etag/actions/workflows/codeql-analysis.yml)

Generate an accurate S3 ETAG in Node.js for any file (including multipart). 

Please Note, this only works for unencrypted buckets.

## Installation

```console
npm install s3-etag
```

## Usage

```ts
import { generateETag } from 's3-etag';

// Simple MD5 hash of contents for non-multipart files
const etag = generateETag(absoluteFilePath);

// MD5 hash of combined contents & part number (see below) for multipart files
const partSizeInBytes = 10 * 1024 * 1024; // 10mb
const etag = generateETag(absoluteFilePath, partSizeInBytes);
```

## How It Works

This is a Node.js implementation of [this algorithm](https://stackoverflow.com/a/19896823/492325).

At a high level:

- If no `partSizeInBytes` is specified, return MD5 hash of file contents
- If `partSizeInBytes` is specified:
  - Generate parts by comparing `partSizeInBytes` to the file size
  - Read each part from the file, MD5 hash the part, and append it to a global combined hash
  - Once all parts are processed, generate a new MD5 from the global combined hash, and suffix with the amount of parts

## License

See [LICENSE.md](./LICENSE.md).
