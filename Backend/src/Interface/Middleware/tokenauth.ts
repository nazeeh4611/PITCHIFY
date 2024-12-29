import jwt, { SignOptions } from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();

const accessSecret = process.env.JWT_ACCESS_SECRET;
const refreshSecret = process.env.JWT_REFRESH_SECRET;

if (!accessSecret || !refreshSecret) {
  throw new Error("JWT_ACCESS_SECRET and JWT_REFRESH_SECRET must be set in environment variables");
}

export const generateToken = (payload: { id: string; email: string; role: string }, options?: SignOptions): string => {
  return jwt.sign(payload, accessSecret, {
    ...(options || {}),
    expiresIn: "1h",
  });
};

export const generateRefreshToken = (payload: { id: string; email: string }, options?: SignOptions): string => {
  return jwt.sign(payload, refreshSecret, {
    ...(options || {}),
    expiresIn: "7d",
  });
};
