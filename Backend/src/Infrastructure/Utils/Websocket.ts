import { Server } from 'socket.io';
import { Types } from 'mongoose';

export function setupWebSocket(server: any) {
    const io = new Server(server, {
        cors: {
            origin: "*", // Adjust in production
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {
        console.log('New client connected');

        // Join chat room
        socket.on('join_chat', (chatId: string) => {
            socket.join(chatId);
            console.log(`User joined chat ${chatId}`);
        });

        // Send message
        socket.on('send_message', async (messageData: {
            chatId: string;
            senderId: string;
            content: string;
        }) => {
            // Here you would typically:
            // 1. Validate the message
            // 2. Save to database
            // 3. Broadcast to room
            io.to(messageData.chatId).emit('receive_message', messageData);
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    });

    return io;
}