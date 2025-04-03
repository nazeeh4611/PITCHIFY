"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntrepreneurGetChatUsecase = void 0;
class EntrepreneurGetChatUsecase {
    constructor(chatrepo, entrepreneurRepo) {
        this.chatrepo = chatrepo;
        this.entrepreneurRepo = entrepreneurRepo;
    }
    async execute(email) {
        try {
            const entrepreneur = await this.entrepreneurRepo.findbyEmail(email);
            const entrepreneurId = entrepreneur?._id;
            if (!entrepreneurId) {
                throw new Error("Entrepreneur not found or ID is undefined");
            }
            const chats = await this.chatrepo.getChatsByEntrepreneur(entrepreneurId);
            return chats;
        }
        catch (error) {
            console.error("Error fetching chats:", error);
            throw error;
        }
    }
}
exports.EntrepreneurGetChatUsecase = EntrepreneurGetChatUsecase;
