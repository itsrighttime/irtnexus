import { DownloadMethods } from "./download";
import { LifecycleMethods } from "./lifecycle";
import { MultipartUploadMethods } from "./multipart";
import { ProcessingMethods } from "./processing";
import { SecurityMethods } from "./security";
import { StorageCapabilities } from "./storage.types";
import { UploadMethods } from "./upload";
import { VersioningMethods } from "./versioning";

export interface StorageDriver
  extends
    UploadMethods,
    MultipartUploadMethods,
    DownloadMethods,
    VersioningMethods,
    LifecycleMethods,
    SecurityMethods,
    ProcessingMethods {
  capabilities: StorageCapabilities;
}
