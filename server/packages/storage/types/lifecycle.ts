export interface LifecycleMethods {
  delete(fileId: string): Promise<void>;

  softDelete(fileId: string): Promise<void>;

  purge(fileId: string): Promise<void>;

  archive(fileId: string): Promise<void>;

  restore(fileId: string): Promise<void>;

  cleanupExpired(): Promise<void>;
}
