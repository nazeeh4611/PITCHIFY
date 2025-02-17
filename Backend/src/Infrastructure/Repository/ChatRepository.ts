import { Types } from "mongoose";
import { IChatRepository } from "../../Domain/Interface/ChatInterface";
import { IChatData } from "../../Domain/entities/Chatentity";
import ChatModel from "../../Infrastructure/Database/Model/ChatModel";

export class ChatRepositoryImpl implements IChatRepository {
    async create(chat: IChatData): Promise<IChatData> {
        try {
            const newChat = await ChatModel.create(chat);
            return newChat.toObject();
        } catch (error) {
            console.error("Error creating chat:", error);
            throw new Error("Failed to create chat");
        }
    }

    async findById(id: Types.ObjectId): Promise<IChatData | null> {
        try {
            return await ChatModel.findById(id)
                .populate("investor") // Populating investor
                .populate("entrepreneur") // If needed
                .populate("latestmessage") // If needed
                .lean()
                .exec();
        } catch (error) {
            console.error("Error finding chat by ID:", error);
            return null;
        }
    }

    async getChatsByEntrepreneur(entrepreneurId: Types.ObjectId): Promise<IChatData[] | null> {
        try {
            const chats = await ChatModel.find({ entrepreneur: entrepreneurId })
                .populate("investor") // Ensure investor is populated
                .populate("entrepreneur") // Ensure entrepreneur is populated
                .populate("latestmessage") // Populate latest message
                .sort({ updatedAt: -1 })
                .lean()
                .exec();

            return chats;
        } catch (error) {
            console.error("Error fetching entrepreneur chats:", error);
            return null;
        }
    }

    async findByParticipants(
        entrepreneurId: Types.ObjectId,
        investorId: Types.ObjectId,
        relatedModelId?: Types.ObjectId
    ): Promise<IChatData | null> {
        try {
            const query: any = {
                entrepreneur: entrepreneurId,
                investor: investorId
            };

            if (relatedModelId) {
                query.relatedModel = relatedModelId;
            }

            return await ChatModel.findOne(query)
                .populate("investor")
                .populate("entrepreneur")
                .populate("latestmessage")
                .lean()
                .exec();
        } catch (error) {
            console.error("Error finding chat by participants:", error);
            return null;
        }
    }

    async findAllByUser(userId: Types.ObjectId): Promise<IChatData[]> {
        try {
            return await ChatModel.find({
                $or: [{ entrepreneur: userId }, { investor: userId }]
            })
                .populate("investor")
                .populate("entrepreneur")
                .populate("latestmessage")
                .select("-__v") // Excluding unnecessary fields
                .lean()
                .exec();
        } catch (error) {
            console.error("Error finding all chats by user:", error);
            return [];
        }
    }

    async updateLatestMessage(chatId: Types.ObjectId, messageId: Types.ObjectId): Promise<IChatData | null> {
        try {
            return await ChatModel.findByIdAndUpdate(
                chatId,
                { $push: { latestmessage: messageId } },
                { new: true }
            )
                .populate("investor")
                .populate("entrepreneur")
                .populate("latestmessage")
                .lean()
                .exec();
        } catch (error) {
            console.error("Error updating latest message:", error);
            return null;
        }
    }

    async delete(id: Types.ObjectId): Promise<boolean> {
        try {
            const result = await ChatModel.findByIdAndDelete(id).exec();
            return result !== null;
        } catch (error) {
            console.error("Error deleting chat:", error);
            return false;
        }
    }

    async getAll(id:string): Promise<IChatData[] | null> {
        try {
            console.log(id,"id in repo")
            const msg = await ChatModel.find({investor:id})
            .populate("investor")
            .populate("entrepreneur")
            .populate("latestmessage")
            .lean()
            .exec();

            // console.log(msg,"in msg repo")
            return msg
        } catch (error) {
            console.error("Error fetching all chats:", error);
            return null;
        }
    }
}
