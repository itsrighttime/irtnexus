# Fastify Upload Adapter — Developer Guide

## Overview

The `fastifyUploadAdapter` is a utility function for handling multipart file uploads in **Fastify**. It supports:

- Multiple file uploads.
- Regular form fields.
- Clean separation between files and form fields in the response.

It uses a pluggable **storage driver** (`StorageDriverFactory`) for uploading files, and logs detailed debug information via a logger.

## Installation / Imports

```ts
import { FastifyRequest } from "fastify";
import { fastifyUploadAdapter } from "#path/to/adapter";
import { UploadOptions } from "#packages/storage";
```

## Function Signature

```ts
async function fastifyUploadAdapter(
  request: FastifyRequest,
  options?: UploadOptions,
): Promise<{
  files: Array<FileRecord>;
  fields: Record<string, any>;
}>;
```

### Parameters

| Parameter | Type                       | Description                                                                                                |
| --------- | -------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `request` | `FastifyRequest`           | Fastify request object. Must support `multipart/form-data`.                                                |
| `options` | `UploadOptions` (optional) | Options passed to the storage driver for file uploads (e.g., default metadata, public flag, folder, etc.). |

### Return Value

Returns a Promise resolving to an object with two keys:

- `files`: Array of uploaded file records. Each record contains:

  ```ts
  {
    id: string;
    filename: string;
    extension: string;
    category: string;
    mimeType: string;
    size: number;
    path: string;
    createdAt: string;
    metadata: Record<string, any>;
    public: boolean;
  }
  ```

- `fields`: Object containing all regular form field values submitted with the request.

## Example Usage

```ts
fastify.post("/upload", async (request, reply) => {
  const uploadOptions = {
    folder: "uploads/documents",
    metadata: { uploadedBy: "admin" },
  };

  const { files, fields } = await fastifyUploadAdapter(request, uploadOptions);

  return {
    success: true,
    files,
    fields,
  };
});
```

### Sample Response

```json
{
  "success": true,
  "files": [
    {
      "id": "973c44f8-68a9-4d21-86e9-19123c004535",
      "filename": "Resume.pdf",
      "extension": "pdf",
      "category": "document",
      "mimeType": "application/pdf",
      "size": 73025,
      "path": "/storage/files/document/uploads/973c44f8-68a9-4d21-86e9-19123c004535.pdf",
      "createdAt": "2026-03-15T08:41:42.437Z",
      "metadata": {
        "uploadedBy": "admin"
      },
      "public": false
    }
  ],
  "fields": {
    "name": "Danishan",
    "class": "XII"
  }
}
```

## Features

1. **Multiple file support**: Handles multiple file parts in a single request.
2. **Field support**: Collects all non-file fields into a separate object.
3. **Detailed logging**: Tracks each file and field processing step.
4. **Pluggable storage driver**: Supports any storage backend via `StorageDriverFactory`.

## Notes / Best Practices

- Always ensure the request has **`Content-Type: multipart/form-data`**.
- File sizes are currently buffered in memory; for very large files, consider streaming directly to storage.
- Metadata can be provided globally via `options.metadata`, or dynamically via form fields.
- All uploaded files are returned as an array for consistency, even if only one file is uploaded.

## Example with Multiple Files and Fields

```ts
const { files, fields } = await fastifyUploadAdapter(request, {
  folder: "user-uploads",
});

console.log(files.length); // Number of uploaded files
console.log(fields.name); // Form field value
```

This structure makes frontend integration simple: files can be displayed/downloaded, and fields can be stored/processed separately.
