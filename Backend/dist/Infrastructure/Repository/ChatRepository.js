"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatRepositoryImpl = void 0;
const ChatModel_1 = __importDefault(require("../../Infrastructure/Database/Model/ChatModel"));
class ChatRepositoryImpl {
    async create(chat) {
        try {
            const newChat = await ChatModel_1.default.create(chat);
            return newChat.toObject();
        }
        catch (error) {
            console.error("Error creating chat:", error);
            throw new Error("Failed to create chat");
        }
    }
    async findById(id) {
        try {
            return await ChatModel_1.default.findById(id)
                .populate("investor") // Populating investor
                .populate("entrepreneur") // If needed
                .populate("latestmessage") // If needed
                .lean()
                .exec();
        }
        catch (error) {
            console.error("Error finding chat by ID:", error);
            return null;
        }
    }
    async getChatsByEntrepreneur(entrepreneurId) {
        try {
            const chats = await ChatModel_1.default.find({ entrepreneur: entrepreneurId })
                .populate("investor") // Ensure investor is populated
                .populate("entrepreneur") // Ensure entrepreneur is populated
                .populate("latestmessage") // Populate latest message
                .sort({ updatedAt: -1 })
                .lean()
                .exec();
            return chats;
        }
        catch (error) {
            console.error("Error fetching entrepreneur chats:", error);
            return null;
        }
    }
    async findByParticipants(entrepreneurId, investorId, relatedModelId) {
        try {
            const query = {
                entrepreneur: entrepreneurId,
                investor: investorId
            };
            if (relatedModelId) {
                query.relatedModel = relatedModelId;
            }
            return await ChatModel_1.default.findOne(query)
                .populate("investor")
                .populate("entrepreneur")
                .populate("latestmessage")
                .lean()
                .exec();
        }
        catch (error) {
            console.error("Error finding chat by participants:", error);
            return null;
        }
    }
    async findAllByUser(userId) {
        try {
            return await ChatModel_1.default.find({
                $or: [{ entrepreneur: userId }, { investor: userId }]
            })
                .populate("investor")
                .populate("entrepreneur")
                .populate("latestmessage")
                .select("-__v") // Excluding unnecessary fields
                .lean()
                .exec();
        }
        catch (error) {
            console.error("Error finding all chats by user:", error);
            return [];
        }
    }
    async updateLatestMessage(chatId, messageId) {
        try {
            return await ChatModel_1.default.findByIdAndUpdate(chatId, { $push: { latestmessage: messageId } }, { new: true })
                .populate("investor")
                .populate("entrepreneur")
                .populate("latestmessage")
                .lean()
                .exec();
        }
        catch (error) {
            console.error("Error updating latest message:", error);
            return null;
        }
    }
    async delete(id) {
        try {
            const result = await ChatModel_1.default.findByIdAndDelete(id).exec();
            return result !== null;
        }
        catch (error) {
            console.error("Error deleting chat:", error);
            return false;
        }
    }
    async getAll(id) {
        try {
            console.log(id, "id in repo");
            const msg = await ChatModel_1.default.find({ investor: id })
                .populate("investor")
                .populate("entrepreneur")
                .populate("latestmessage")
                .lean()
                .exec();
            // console.log(msg,"in msg repo")
            return msg;
        }
        catch (error) {
            console.error("Error fetching all chats:", error);
            return null;
        }
    }
}
exports.ChatRepositoryImpl = ChatRepositoryImpl;
