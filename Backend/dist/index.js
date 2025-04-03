"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const EntrepreneurRoute_1 = require("./Interface/Route/EntrepreneurRoute");
const InvestorRoute_1 = require("./Interface/Route/InvestorRoute");
const AdminRoute_1 = require("./Interface/Route/AdminRoute");
const ChatRoute_1 = __importDefault(require("./Interface/Route/ChatRoute"));
const dotenv_1 = __importDefault(require("dotenv"));
const Db_1 = require("./Infrastructure/Database/Connection/Db");
const http_1 = require("http");
const socket_io_1 = require("socket.io");
require("./Infrastructure/Jobs/Cronjob");
const morgan_1 = __importDefault(require("morgan"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
(0, Db_1.connectDB)();
const PORT = 3009;
const app = (0, express_1.default)();
// CORS configuration
app.use((0, cors_1.default)({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Setup Morgan logging
const logStream = fs_1.default.createWriteStream(path_1.default.join(__dirname, '../src/Infrastructure/Logs/accesslog.log'), { flags: 'a' });
app.use((0, morgan_1.default)('combined', { stream: logStream }));
app.use((0, morgan_1.default)('dev'));
// Define Routes
app.use('/api/entrepreneur', EntrepreneurRoute_1.entrepreneurrouter);
app.use('/api/investor', InvestorRoute_1.InvestorRouter);
app.use('/api/admin', AdminRoute_1.AdminRouter);
app.use('/api/chat', ChatRoute_1.default);
// Create HTTP and WebSocket server
const server = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST'],
    },
});
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
    socket.on('send_message', (data) => {
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
