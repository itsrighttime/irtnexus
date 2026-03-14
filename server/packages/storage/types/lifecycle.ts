export interface LifecycleMethods {
  delete(fileId: string): Promise<boolean>;

  softDelete(fileId: string): Promise<boolean>;

  purge(fileId: string): Promise<boolean>;

  archive(fileId: string): Promise<boolean>;

  restore(fileId: string): Promise<boolean>;

  cleanupExpired(options?: { before?: Date }): Promise<number>;
}
