"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRefreshToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const accessSecret = process.env.JWT_ACCESS_SECRET;
const refreshSecret = process.env.JWT_REFRESH_SECRET;
if (!accessSecret || !refreshSecret) {
    throw new Error("JWT_ACCESS_SECRET and JWT_REFRESH_SECRET must be set in environment variables");
}
const generateToken = (payload, options) => {
    return jsonwebtoken_1.default.sign(payload, accessSecret, {
        ...(options || {}),
        expiresIn: "1h",
    });
};
exports.generateToken = generateToken;
const generateRefreshToken = (payload, options) => {
    return jsonwebtoken_1.default.sign(payload, refreshSecret, {
        ...(options || {}),
        expiresIn: "7d",
    });
};
exports.generateRefreshToken = generateRefreshToken;
