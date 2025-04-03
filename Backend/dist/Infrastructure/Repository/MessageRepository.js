"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageRepositoryImpl = void 0;
const MessageModel_1 = require("../Database/Model/MessageModel");
class MessageRepositoryImpl {
    async createMessage(messageData) {
        const message = await MessageModel_1.MessageModel.create(messageData);
        return message.toObject();
    }
    async getMessagesByChatId(chatId) {
        console.log(chatId, "may getting hereassss");
        return await MessageModel_1.MessageModel.find({ chat: chatId }).sort({ createdAt: 1 });
    }
}
exports.MessageRepositoryImpl = MessageRepositoryImpl;
