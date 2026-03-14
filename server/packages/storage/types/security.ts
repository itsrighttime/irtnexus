import { Readable } from "./storage.types";

export interface SecurityMethods {
  encrypt(fileId: string): Promise<boolean>;

  decrypt(fileId: string): Promise<Readable>;

  setPermissions(fileId: string, permissions: string[]): Promise<void>;

  checkAccess(fileId: string, userId: string, action: string): Promise<boolean>;
}
