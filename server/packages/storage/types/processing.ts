export interface ProcessingMethods {
  generateThumbnail(fileId: string): Promise<Buffer>;

  generatePreview(fileId: string): Promise<Buffer>;

  extractText(fileId: string): Promise<string>;

  scanVirus(fileId: string): Promise<boolean>;
}
