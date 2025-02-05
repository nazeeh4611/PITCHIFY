import { Types } from 'mongoose';
import { IMessage } from '../entities/MessageEntity';

export interface IMessageRepository {
    createMessage(messageData: IMessage): Promise<IMessage>;
    getMessagesByChatId(chatId: Types.ObjectId): Promise<IMessage[]>;
}