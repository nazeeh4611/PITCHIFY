import express, { Request, Response } from 'express';
import { generateChatResponse } from '../Controller/Chatbotcontroller';

const Chatrout = express.Router();

Chatrout.post('/generate', async (req: Request, res: Response) => {
  await generateChatResponse(req, res);
});

export default Chatrout;
