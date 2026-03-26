import dotenv from "dotenv";
dotenv.config();

export const repoConfig = {
  asyncVersioning: process.env.REPO_ASYNC_VERSIONING === "true" ? true : false,
  asyncWrites: process.env.REPO_ASYNC_WRITE === "true" ? true : false,
};
