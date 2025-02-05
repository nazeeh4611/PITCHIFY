import { Types } from 'mongoose';
import { IMessage, MessageModel } from '../Database/Model/MessageModel';
import {IMessageRepository} from "../../Domain/Interface/MessageInterface"
 

export class MessageRepositoryImpl implements IMessageRepository {
    async createMessage(messageData: IMessage): Promise<IMessage> {
        const message = await MessageModel.create(messageData);
        return message.toObject();
    }

    async getMessagesByChatId(chatId: Types.ObjectId): Promise<IMessage[]> {
        console.log(chatId,"may getting hereassss")
        return await MessageModel.find({ chat: chatId }).sort({ createdAt: 1 });
    }
}