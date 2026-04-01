export interface TokenProvider {
  generate(payload: any): Promise<{ raw: string; hashed: string | null }>;
  verify(raw: string, stored: string): Promise<boolean>;
}
