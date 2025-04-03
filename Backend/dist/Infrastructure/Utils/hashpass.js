"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifypass = exports.hashpass = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const hashpass = async (password) => {
    const salt = 15;
    const hashedpass = await bcrypt_1.default.hash(password, salt);
    return hashedpass;
};
exports.hashpass = hashpass;
const verifypass = async (password, hash) => {
    return await bcrypt_1.default.compare(password, hash);
};
exports.verifypass = verifypass;
