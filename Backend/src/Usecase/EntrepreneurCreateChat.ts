import { Types } from "mongoose";
import { IChatRepository } from "../Domain/Interface/ChatInterface";
import { IChatData } from "../Domain/entities/Chatentity";
import { IEntrepreneurRepository } from "../Domain/Interface/EntrepreneurInterface";

export class EntrepreneurCreateChatUseCase {
    constructor(
        private chatRepository: IChatRepository,
        private Entrepreneurrepo: IEntrepreneurRepository
    ) {}

    async execute(chatData: {
        investorId: string;
        entrepreneurId: Types.ObjectId;
    }): Promise<{ chatId: string }> {
        try {
            const investorId = this.ensureObjectId(chatData.investorId);


            const entrepreneurId = chatData.entrepreneurId

        

            const chatPayload: IChatData = {
                entrepreneur: entrepreneurId,
                investor: investorId,
                chatname: `Chat between ${investorId} and ${entrepreneurId}`
            };

            const existingChat = await this.chatRepository.findByParticipants(
                entrepreneurId, 
                investorId, 
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
