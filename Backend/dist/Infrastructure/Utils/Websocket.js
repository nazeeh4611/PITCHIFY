"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupWebSocket = setupWebSocket;
const socket_io_1 = require("socket.io");
function setupWebSocket(server) {
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: "*", // Adjust in production
            methods: ["GET", "POST"]
        }
    });
    io.on('connection', (socket) => {
        console.log('New client connected');
        // Join chat room
        socket.on('join_chat', (chatId) => {
            socket.join(chatId);
            console.log(`User joined chat ${chatId}`);
        });
        // Send message
        socket.on('send_message', async (messageData) => {
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
