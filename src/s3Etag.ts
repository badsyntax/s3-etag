/**
 * Generate an S3 ETAG (with multipart support)
 * An implementation of this algorithm: https://stackoverflow.com/a/19896823/492325
 * Author: Richard Willis <willis.rh@gmail.com>
 */
import fs from 'node:fs';
import crypto, { BinaryLike } from 'node:crypto';

export const defaultPartSizeInBytes = 5 * 1024 * 1024; // 5MB

function md5(contents: string | BinaryLike): string {
  return crypto.createHash('md5').update(contents).digest('hex');
}

export function generateETag(filePath: string, partSizeInBytes = 0): string {
  if (partSizeInBytes === 0) {
    return md5(fs.readFileSync(filePath));
  }
  const { size: fileSizeInBytes } = fs.statSync(filePath);
  let parts = Math.floor(fileSizeInBytes / partSizeInBytes);
  if (fileSizeInBytes % partSizeInBytes > 0) {
    parts += 1;
  }
  const fileDescriptor = fs.openSync(filePath, 'r');
  let totalMd5 = '';

  for (let part = 0; part < parts; part++) {
    const skipBytes = partSizeInBytes * part;
    const totalBytesLeft = fileSizeInBytes - skipBytes;
    const bytesToRead = Math.min(totalBytesLeft, partSizeInBytes);
    const buffer = Buffer.alloc(bytesToRead);
    fs.readSync(fileDescriptor, buffer, 0, bytesToRead, skipBytes);
    totalMd5 += md5(buffer);
  }

  const combinedHash = md5(Buffer.from(totalMd5, 'hex'));
  const etag = `${combinedHash}-${parts}`;
  return etag;
}
