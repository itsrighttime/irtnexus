import { StorageDriver } from "../types/storage";
import { StorageDriverType } from "../types/storage.types";
import { AzureStorageDriver } from "./azure/AzureStorageDriver";
import { GCSStorageDriver } from "./gcs/GCSStorageDriver";
import { LocalStorageDriver } from "./local/LocalStorageDriver";
import { S3StorageDriver } from "./s3/S3StorageDriver";

export class StorageDriverFactory {
  static createDriver(type: StorageDriverType = "local"): StorageDriver {
    switch (type) {
      case "s3":
        return new S3StorageDriver();
      case "local":
        return new LocalStorageDriver();
      case "azure":
        return new AzureStorageDriver();
      case "gcs":
        return new GCSStorageDriver();
      default:
        throw new Error(`Unsupported storage driver type: ${type}`);
    }
  }
}

/*

import { StorageDriverFactory } from "./StorageDriverFactory";

// Select driver dynamically, e.g., from config or env
const driverType: StorageDriverType = process.env.STORAGE_TYPE as StorageDriverType;

// Get concrete driver instance
const storageDriver = StorageDriverFactory.createDriver(driverType);

// Use any method without worrying about implementation
await storageDriver.uploadFile(Buffer.from("Hello world"), { fileName: "test.txt" });
const data = await storageDriver.download("fileId123");


*/
