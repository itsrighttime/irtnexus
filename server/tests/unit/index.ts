import { StorageDriverFactory } from "#packages/storage";

export const t = "";

const t1 = StorageDriverFactory.createDriver();

await t1.softDelete("Ids");
