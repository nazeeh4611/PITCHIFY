"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntrepreneurCreateChatUseCase = void 0;
const mongoose_1 = require("mongoose");
class EntrepreneurCreateChatUseCase {
    constructor(chatRepository, Entrepreneurrepo) {
        this.chatRepository = chatRepository;
        this.Entrepreneurrepo = Entrepreneurrepo;
    }
    async execute(chatData) {
        try {
            const investorId = this.ensureObjectId(chatData.investorId);
            const entrepreneurId = chatData.entrepreneurId;
            const chatPayload = {
                entrepreneur: entrepreneurId,
                investor: investorId,
                chatname: `Chat between ${investorId} and ${entrepreneurId}`
            };
            const existingChat = await this.chatRepository.findByParticipants(entrepreneurId, investorId);
            if (existingChat) {
                return { chatId: existingChat._id?.toString() || '' };
            }
            const newChat = await this.chatRepository.create(chatPayload);
            return { chatId: newChat._id?.toString() || '' };
        }
        catch (error) {
            console.error("Chat Creation Error:", error);
            throw error;
        }
    }
    ensureObjectId(id) {
        return id instanceof mongoose_1.Types.ObjectId
            ? id
            : new mongoose_1.Types.ObjectId(id);
    }
}
exports.EntrepreneurCreateChatUseCase = EntrepreneurCreateChatUseCase;
