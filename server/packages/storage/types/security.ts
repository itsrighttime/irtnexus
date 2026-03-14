export interface SecurityMethods {
  encrypt(fileId: string): Promise<void>;

  decrypt(fileId: string): Promise<Buffer>;

  setPermissions(fileId: string, permissions: string[]): Promise<void>;

  checkAccess(fileId: string, userId: string, action: string): Promise<boolean>;
}
