import { Types } from "mongoose";
import { IChatRepository } from "../Domain/Interface/ChatInterface";
import { IChatData } from "../Domain/entities/Chatentity";
import { IInvestorRepository } from "../Domain/Interface/InvestorInterface";

export class CreateChatUseCase {
    constructor(
        private chatRepository: IChatRepository,
        private Investorrepo: IInvestorRepository
    ) {}

    async execute(chatData: {
        entrepreneurId: string;
        investorEmail: string;
        modelId?: string;
    }): Promise<{ chatId: string }> {
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

            const chatPayload: IChatData = {
                entrepreneur: entrepreneurId,
                investor: investorId,
                relatedModel: relatedModelId,
                chatname: `Chat between ${entrepreneurId} and ${investorId}`
            };

            const existingChat = await this.chatRepository.findByParticipants(
                entrepreneurId, 
                investorId, 
                relatedModelId
            );

            if (existingChat) {
                return { chatId: existingChat._id?.toString() || '' };
            }

            const newChat = await this.chatRepository.create(chatPayload);

            return { chatId: newChat._id?.toString() || '' };
        } catch (error) {
            console.error("Chat Creation Error:", error);
            throw error;
        }
    }

    private ensureObjectId(id: string | Types.ObjectId): Types.ObjectId {
        return id instanceof Types.ObjectId 
            ? id 
            : new Types.ObjectId(id);
    }
}
