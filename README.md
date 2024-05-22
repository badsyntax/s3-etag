
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

If the partSizeInBytes is unknown, you can find it by using AWS CLI:
   

 1. Use `head-object` to retrieve the object's metadata using the following command, where `raw-files` is the bucket name, and `IMG2345.CR2` is the key
	 `aws s3api head-object --bucket raw-files --key IMG2345.CR2`
    this will return
      ```
        {
        "AcceptRanges": "bytes",
        "ContentType": "text/html",
        "LastModified": "2024-05-22T08:45:10+00:00"
        "ContentLength": 28333464,
        "ETag": "\"85ae33db28930d3afe594da14cd190bb-2\"",
        "VersionId": "28P4UkX5sCO.8vbyMojvecHndkHDwf",
        "ContentType": "binary/octet-stream",
        "ServerSideEncryption": "AES256",
        "Metadata": {}
        }
    ```
 2. Look for a `-n` at the end of the eTag, where `n` is a number >= 2, representing the number of parts/chunks. For single part objects, the eTag will simply be the MD5 of the object.
 3. Use  `aws s3api head-object --bucket raw-files --key IMG2345.CR2 --part-number 1`to get the metadata of the first part/chunk. This will return 
	 ```
        {
        "AcceptRanges": "bytes",
        "ContentType": "text/html",
        "LastModified": "2024-05-22T08:45:10+00:00"
        "ContentLength": 17179870,
        "ETag": "\"85ae33db28930d3afe594da14cd190bb-2\"",
        "VersionId": "28P4UkX5sCO.8vbyMojvecHndkHDwf",
        "ContentType": "binary/octet-stream",
        "ServerSideEncryption": "AES256",
        "Metadata": {},
        "PartsCount": 2
        }
    ```
 4. Use the `ContentLength` value as the `partSizeInBytes`

## License

See [LICENSE.md](./LICENSE.md).
