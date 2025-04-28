import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { entrepreneurrouter } from './Interface/Route/EntrepreneurRoute';
import { InvestorRouter } from './Interface/Route/InvestorRoute';
import { AdminRouter } from './Interface/Route/AdminRoute';
import Chatrouter from "./Interface/Route/ChatRoute";
import dotenv from 'dotenv';
import { connectDB } from './Infrastructure/Database/Connection/Db';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io'; 
import "./Infrastructure/Jobs/Cronjob";
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';

dotenv.config();
connectDB();

const PORT = 3009;
const app = express();

// CORS configuration
// app.use(
//   cors({
//     origin: 'http://localhost:5173',
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     allowedHeaders: ['Content-Type', 'Authorization'],
//     credentials: true,
//   })
// );

app.use(
  cors({
    origin: 'https://pitchify-ft4m.vercel.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup Morgan logging
const logStream = fs.createWriteStream(
  path.join(__dirname, '../src/Infrastructure/Logs/accesslog.log'),
  { flags: 'a' }
);
app.use(morgan('combined', { stream: logStream })); 
app.use(morgan('dev')); 

// Define Routes
app.use('/api/entrepreneur', entrepreneurrouter);
app.use('/api/investor', InvestorRouter);
app.use('/api/admin', AdminRouter);
app.use('/api/chat', Chatrouter);

// Create HTTP and WebSocket server
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

interface ChatMessage {
  sender: string;
  message: string;
  timestamp: string;
}

io.on('connection', (socket: Socket) => {  
  console.log('A user connected:', socket.id);

  socket.on('send_message', (data: ChatMessage) => { 
    console.log('Message received:', data);
    io.emit('receive_message', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
