"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateChatUseCase = void 0;
const mongoose_1 = require("mongoose");
class CreateChatUseCase {
    constructor(chatRepository, Investorrepo) {
        this.chatRepository = chatRepository;
        this.Investorrepo = Investorrepo;
    }
    async execute(chatData) {
        try {
            const entrepreneurId = this.ensureObjectId(chatData.entrepreneurId);
            const investor = await this.Investorrepo.findbyEmail(chatData.investorEmail);
            if (!investor) {
                throw new Error(`Investor with email ${chatData.investorEmail} not found.`);
            }
            const investorId = investor._id;
            const relatedModelId = chatData.modelId
                ? this.ensureObjectId(chatData.modelId)
                : undefined;
            const chatPayload = {
                entrepreneur: entrepreneurId,
                investor: investorId,
                relatedModel: relatedModelId,
                chatname: `Chat between ${entrepreneurId} and ${investorId}`
            };
            const existingChat = await this.chatRepository.findByParticipants(entrepreneurId, investorId, relatedModelId);
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
exports.CreateChatUseCase = CreateChatUseCase;
