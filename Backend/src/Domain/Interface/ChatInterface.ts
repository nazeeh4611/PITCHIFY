import { Types } from "mongoose";
import { IChatData } from "../entities/Chatentity";

export interface IChatRepository {
    create(chat: IChatData): Promise<IChatData>;
    findById(id: Types.ObjectId): Promise<IChatData | null>;
    findByParticipants(
        entrepreneurId: Types.ObjectId, 
        investorId: Types.ObjectId, 
        relatedModelId?: Types.ObjectId
    ): Promise<IChatData | null>;
    findAllByUser(userId: Types.ObjectId): Promise<IChatData[]>;
    updateLatestMessage(
        chatId: Types.ObjectId, 
        messageId: Types.ObjectId
    ): Promise<IChatData | null>;
    delete(id: Types.ObjectId): Promise<boolean>;
    
    getAll(id:string):Promise<IChatData[] | null>;
    getChatsByEntrepreneur(entrepreneurId:Types.ObjectId):Promise<IChatData[] | null>
}

// User Repository Interface
export interface IUserRepository {
    findByEmail(email: string): Promise<{
        _id: Types.ObjectId;
        email: string;
        // Add other necessary user properties
    } | null>;

}