import { IChatRepository } from "../Domain/Interface/ChatInterface";
import { IEntrepreneurRepository } from "../Domain/Interface/EntrepreneurInterface";
import { Types } from "mongoose"; // Ensure you're importing Types from mongoose

export class EntrepreneurGetChatUsecase {
    constructor(
        private chatrepo: IChatRepository,
        private entrepreneurRepo: IEntrepreneurRepository
    ) {}

    async execute(email: string) {
        try {
            const entrepreneur = await this.entrepreneurRepo.findbyEmail(email);
            const entrepreneurId = entrepreneur?._id;

            if (!entrepreneurId) {
                throw new Error("Entrepreneur not found or ID is undefined");
            }

            const chats = await this.chatrepo.getChatsByEntrepreneur(entrepreneurId);
            return chats;
        } catch (error) {
            console.error("Error fetching chats:", error);
            throw error;
        }
    }
}
