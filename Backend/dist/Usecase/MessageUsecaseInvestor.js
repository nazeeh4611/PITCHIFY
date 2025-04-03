"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageUseCase = void 0;
const mongoose_1 = require("mongoose");
class MessageUseCase {
    constructor(messageRepository, chatRepository, investorrepo) {
        this.messageRepository = messageRepository;
        this.chatRepository = chatRepository;
        this.investorrepo = investorrepo;
    }
    async sendMessage(data) {
        console.log(data, "this be the data in message usecase");
        const senderId = data.senderId;
        const messageData = {
            chat: new mongoose_1.Types.ObjectId(data.chatId),
            sender: new mongoose_1.Types.ObjectId(senderId),
            reciever: new mongoose_1.Types.ObjectId(data.receiverId),
            content: data.content
        };
        // Create message
        const message = await this.messageRepository.createMessage(messageData);
        console.log(message, "this be the message");
        await this.chatRepository.updateLatestMessage(new mongoose_1.Types.ObjectId(data.chatId), message._id);
        return message;
    }
    async getChatMessages(chatId) {
        return await this.messageRepository.getMessagesByChatId(new mongoose_1.Types.ObjectId(chatId));
    }
}
exports.MessageUseCase = MessageUseCase;
