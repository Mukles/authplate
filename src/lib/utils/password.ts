// src/utils/password.ts
import bcrypt from "bcrypt";

export interface SaltedHash {
  salt: string;
  hash: string;
}

export async function saltAndHashPassword(
  password: string,
): Promise<SaltedHash> {
  const saltRounds = 10; // You can adjust this for security/performance
  const salt = await bcrypt.genSalt(saltRounds);
  const hash = await bcrypt.hash(password, salt);
  return { salt, hash };
}
