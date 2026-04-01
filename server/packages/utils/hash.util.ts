import bcrypt from "bcrypt";

export const HASH_SALT: number = 12;

export const hashText = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, HASH_SALT);
};

export const compareHashText = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};