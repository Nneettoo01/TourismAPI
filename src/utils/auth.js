import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET;

export async function hashPassword(password) {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

export async function comparePassword(password, hashPassword) {
  return bcrypt.compare(password, hashPassword);
}

export function generateToken(user) {
  return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: "1h",
  });
}
export function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}
