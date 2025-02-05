import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { entrepreneurrouter } from './Interface/Route/EntrepreneurRoute';
import { InvestorRouter } from './Interface/Route/InvestorRoute';
import { AdminRouter } from './Interface/Route/AdminRoute';
import dotenv from 'dotenv';
import { connectDB } from './Infrastructure/Database/Connection/Db';
import { createServer } from 'http';
import { Server } from 'socket.io'; 

dotenv.config();

connectDB();

const PORT = 3009;

const app = express();

app.use(
  cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Entrepreneur Route
app.use('/api/entrepreneur', entrepreneurrouter);

// Investor Route
app.use('/api/investor', InvestorRouter);

// Admin Route
app.use('/api/admin', AdminRouter);

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  // console.log('A user connected:', socket.id);

  socket.on('send_message', (data) => {
    console.log('Message received:', data);

    io.emit('receive_message', data);
  });

  socket.on('disconnect', () => {
    // console.log('User disconnected:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});


