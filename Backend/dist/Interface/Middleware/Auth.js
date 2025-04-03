"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = (roles = []) => {
    return (req, res, next) => {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_ACCESS_SECRET);
            req.user = decoded;
            // Check role
            if (roles.length > 0 && typeof decoded === 'object' && !roles.includes(decoded.role)) {
                res.status(403).json({ message: 'Forbidden' });
                return;
            }
            next();
        }
        catch (err) {
            res.status(401).json({ message: 'Invalid token' });
        }
    };
};
exports.default = authMiddleware;
