"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateChatResponse = void 0;
const generative_ai_1 = require("@google/generative-ai");
const generateChatResponse = async (req, res) => {
    try {
        const { message } = req.body;
        console.log(message, "mayy");
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }
        const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
        const result = await model.generateContent(message);
        const response = result.response;
        const text = response.text();
        return res.status(200).json({ response: text });
    }
    catch (error) {
        console.error('Error generating chat response:', error);
        return res.status(500).json({ error: 'Failed to generate response' });
    }
};
exports.generateChatResponse = generateChatResponse;
exports.default = exports.generateChatResponse;
