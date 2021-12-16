# S3 ETAG

Generate an accurate S3 ETAG for any file (including multipart).

## Installation

```console
npm install s3-etag
```

## Usage

```ts
import { generateETag } from 's3-etag';

const etag = generateETag(absoluteFilePath);

expect(etag).toBe('ba0b9fe20dc67b0e4c478ab3c03dc5ce');
```

## License

See [LICENSE.md](./LICENSE.md).
