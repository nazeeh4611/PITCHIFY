"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const connectDB = async () => {
    try {
        console.log("Connecting to database...");
        await mongoose_1.default.connect(process.env.MONGO_URI);
        console.log("Database connected successfully");
    }
    catch (error) {
        console.error("Error connecting to database:", error);
        throw new Error("Database connection error");
    }
};
exports.connectDB = connectDB;
