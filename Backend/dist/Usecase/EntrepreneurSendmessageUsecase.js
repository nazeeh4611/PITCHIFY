"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntrepreneurMessageUseCase = void 0;
const mongoose_1 = require("mongoose");
class EntrepreneurMessageUseCase {
    constructor(messageRepository, chatRepository, entrepreneurrepo) {
        this.messageRepository = messageRepository;
        this.chatRepository = chatRepository;
        this.entrepreneurrepo = entrepreneurrepo;
    }
    async execute(data) {
        const senderId = data.senderId;
        console.log(senderId, "this be the sender id");
        const messageData = {
            chat: new mongoose_1.Types.ObjectId(data.chatId),
            sender: new mongoose_1.Types.ObjectId(senderId),
            reciever: new mongoose_1.Types.ObjectId(data.receiverId),
            content: data.content
        };
        const message = await this.messageRepository.createMessage(messageData);
        await this.chatRepository.updateLatestMessage(new mongoose_1.Types.ObjectId(data.chatId), message._id);
        return message;
    }
    async getChatMessages(chatId) {
        return await this.messageRepository.getMessagesByChatId(new mongoose_1.Types.ObjectId(chatId));
    }
}
exports.EntrepreneurMessageUseCase = EntrepreneurMessageUseCase;
