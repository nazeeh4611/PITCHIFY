import { Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const generateChatResponse = async (req: Request, res: Response) => {
  try {
    const { message } = req.body;
    console.log(message,"mayy")
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
    const model = genAI.getGenerativeModel({ model:  'gemini-1.5-pro' });
    
    const result = await model.generateContent(message);
    const response = result.response;
    const text = response.text();
    
    return res.status(200).json({ response: text });
  } catch (error) {
    console.error('Error generating chat response:', error);
    return res.status(500).json({ error: 'Failed to generate response' });
  }
};

export default generateChatResponse;
