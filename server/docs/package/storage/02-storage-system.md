# Storage System Developer Guide

## Overview

The storage system provides a **unified interface** for handling file storage across multiple backends:

- **Local filesystem**
- **Amazon S3**
- **Google Cloud Storage (GCS)**
- **Azure Blob Storage**

It supports:

- File uploads and downloads (including streams)
- Multipart uploads
- File versioning
- Lifecycle operations (delete, soft delete, archive, restore, purge)
- File processing (thumbnail, preview, text extraction, virus scanning)
- Security (encryption, decryption, permissions, access checks)

All operations are exposed through **a single driver interface**, so switching backends is seamless.

## 1. Installing and Importing

```ts
// Import the factory and type
import { StorageDriverFactory } from "./drivers/StorageDriverFactory";
import type { StorageDriver } from "./types/storage.js";
```

Optionally, you can only import types for TypeScript type safety:

```ts
import type { UploadOptions, FileRecord } from "./types/storage.types.js";
```

## 2. Creating a Storage Driver

The **StorageDriverFactory** creates driver instances dynamically based on type:

```ts
import { StorageDriverFactory } from "./drivers/StorageDriverFactory";

const driverType = process.env.STORAGE_TYPE as "local" | "s3" | "gcs" | "azure";

// Create driver instance
const storageDriver: StorageDriver =
  StorageDriverFactory.createDriver(driverType);
```

- **Default driver:** `local`
- **Supported types:** `"local" | "s3" | "gcs" | "azure"`

## 3. Uploading Files

The storage driver supports multiple upload methods:

### a) Upload from Buffer/File

```ts
import fs from "fs";

const fileBuffer = fs.readFileSync("example.txt");

const uploadedFile = await storageDriver.uploadFile(fileBuffer, {
  filename: "example.txt",
  mimeType: "text/plain",
  folder: "documents",
  public: true,
});

console.log(uploadedFile.id, uploadedFile.url);
```

### b) Upload from Stream

```ts
import fs from "fs";

const readStream = fs.createReadStream("example.txt");

const uploaded = await storageDriver.uploadStream(readStream, {
  folder: "documents",
});
```

### c) Upload from URL

```ts
const uploaded = await storageDriver.uploadFromUrl(
  "https://example.com/file.jpg",
  { folder: "images" },
);
```

### d) Store Generated File (Buffer only)

```ts
const generatedBuffer = Buffer.from("Generated content");

await storageDriver.storeGeneratedFile(generatedBuffer, {
  filename: "generated.txt",
});
```

## 4. Downloading Files

### a) Download to Buffer

```ts
const fileBuffer = await storageDriver.download("fileId123");
```

### b) Stream File

```ts
const fileStream = storageDriver.stream("fileId123");
fileStream.pipe(fs.createWriteStream("output.txt"));
```

### c) Generate Signed URL

```ts
const url = await storageDriver.generateSignedUrl("fileId123", {
  expiresIn: 3600, // seconds
  action: "read",
});
```

### d) Get Metadata

```ts
const metadata = await storageDriver.getMetadata("fileId123");
console.log(metadata.filename, metadata.size);
```

## 5. Lifecycle Operations

| Method                    | Description                           |
| ------------------------- | ------------------------------------- |
| `delete(fileId)`          | Permanently delete a file             |
| `softDelete(fileId)`      | Mark file as deleted, can be restored |
| `purge(fileId)`           | Force remove soft-deleted files       |
| `archive(fileId)`         | Move file to archive storage          |
| `restore(fileId)`         | Restore archived or soft-deleted file |
| `cleanupExpired(options)` | Clean files older than a date         |

```ts
await storageDriver.softDelete("fileId123");
await storageDriver.restore("fileId123");
```

## 6. Multipart Uploads

For large files:

```ts
// Start multipart upload
const { uploadId } = await storageDriver.initMultipartUpload({
  filename: "bigfile.zip",
});

// Upload chunks
await storageDriver.uploadChunk(uploadId, chunk1, 0);
await storageDriver.uploadChunk(uploadId, chunk2, 1);

// Complete upload
const fileRecord = await storageDriver.completeMultipartUpload(uploadId);
```

## 7. Security Methods

| Method                                | Description                        |
| ------------------------------------- | ---------------------------------- |
| `encrypt(fileId)`                     | Encrypt a file                     |
| `decrypt(fileId)`                     | Decrypt a file and return a stream |
| `setPermissions(fileId, permissions)` | Set access permissions             |
| `checkAccess(fileId, userId, action)` | Verify user access                 |

```ts
await storageDriver.setPermissions("fileId123", ["read", "write"]);
const canRead = await storageDriver.checkAccess("fileId123", "user123", "read");
```

## 8. Processing Methods

| Method                      | Description                |
| --------------------------- | -------------------------- |
| `generateThumbnail(fileId)` | Returns thumbnail buffer   |
| `generatePreview(fileId)`   | Returns preview buffer     |
| `extractText(fileId)`       | Returns extracted text     |
| `scanVirus(fileId)`         | Returns true if virus-free |

## 9. Versioning Methods

```ts
// Add new version
await storageDriver.addVersion("fileId123", newFileBuffer);

// List all versions
const versions = await storageDriver.getVersions("fileId123");

// Revert to specific version
const revertedFile = await storageDriver.revertVersion(
  "fileId123",
  "versionId456",
);
```

## 10. Checking Capabilities

Each driver exposes its capabilities:

```ts
console.log(storageDriver.capabilities);
// Example output:
// { multipart: true, versioning: true, processing: false, encryption: true }
```

## 11. Exporting for External Use

At the entry point of your package:

```ts
export { StorageDriverFactory } from "./drivers/StorageDriverFactory";
export type { StorageDriver } from "./types/storage.js";
```

This setup ensures **consistent usage across backends**, simplifies switching providers, and centralizes all storage-related functionality in a single API.
