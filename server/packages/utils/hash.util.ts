import bcrypt from "bcrypt";

export const HASH_SALT: number = 12;

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, HASH_SALT);
};

export const comparePassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};