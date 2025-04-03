"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Chatbotcontroller_1 = require("../Controller/Chatbotcontroller");
const Chatrout = express_1.default.Router();
Chatrout.post('/generate', async (req, res) => {
    await (0, Chatbotcontroller_1.generateChatResponse)(req, res);
});
exports.default = Chatrout;
