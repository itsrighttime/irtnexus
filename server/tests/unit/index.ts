import { FileRecord, StorageDriverFactory } from "#packages/storage";

export const t = "";

const t1 = StorageDriverFactory.createDriver();

await t1.softDelete("Ids");

import { STORAGE_ROOT } from "#packages/storage/utils";

// Dummy buffer for testing (PDF magic bytes: %PDF)
const dummyPdf = Buffer.from("%PDF-1.4 test pdf content");

STORAGE_ROOT;

const driver = StorageDriverFactory.createDriver();

const uploadFile = driver.uploadFile;

const record: FileRecord = await uploadFile(dummyPdf);

console.log(record);
