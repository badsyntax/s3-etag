#!/bin/bash
# Generate an S3 ETAG for a multipart upload file.
#
# From: https://gist.github.com/emersonf/7413337
# Author: Emerson Farrugia <https://github.com/emersonf>
#
# Modified by: Richard Willis <https://github.com/badsyntax>
# Modifications: Work with bytes instead of MB.
#
# MacOS only! Test script for validating the Node.js port

if [ $# -ne 2 ]; then
    echo "Usage: $0 file partSizeInBytes"
    exit 0
fi

file=$1

if [ ! -f "$file" ]; then
    echo "Error: $file not found."
    exit 1
fi

partSizeInBytes=$2
fileSizeInBytes=$(stat -f%z "$file")
parts=$((fileSizeInBytes / partSizeInBytes))
if [[ $((fileSizeInBytes % partSizeInBytes)) -gt 0 ]]; then
    parts=$((parts + 1))
fi

checksumFile=$(mktemp -t s3md5)

for ((part = 0; part < $parts; part++)); do
    skip=$((partSizeInBytes * part))
    $(dd bs=1 count=$partSizeInBytes skip=$skip if="$file" 2>/dev/null | md5 >>$checksumFile)
done

echo $(xxd -r -p $checksumFile | md5)-$parts
rm $checksumFile
