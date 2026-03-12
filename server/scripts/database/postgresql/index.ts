import { defaultPool, pgPool, DB_MAIN_CONFIG } from "./config/postgres.pool";
import { syncDropUsers } from "./dbAdmin/syncDropUsers";
import { syncUsers } from "./dbAdmin/syncUsers";
import { DATABASES_TABLE_FOLDERS } from "./constant/dbTableFolder";

export const DB_SETUP_HELPERS = {
  defaultPool,
  pgPool,
  DB_MAIN_CONFIG,
  syncDropUsers,
  syncUsers,
  DATABASES_TABLE_FOLDERS,
};
