import { Types } from 'mongoose';
import { IMessageRepository } from '../Domain/Interface/MessageInterface';
import { IChatRepository } from '../Domain/Interface/ChatInterface';
import { IMessage } from '../Domain/entities/MessageEntity';
import { IInvestorRepository } from '../Domain/Interface/InvestorInterface';
export class MessageUseCase {
    constructor(
        private messageRepository: IMessageRepository,
        private chatRepository: IChatRepository,
        private investorrepo:IInvestorRepository
    ) {}

    async sendMessage(data: {
        chatId: string;
        senderId: string;
        receiverId:string;
        content: string;
        createdAt:string;
  
    }):Promise<IMessage>{

        console.log(data,"this be the data in message usecase");
        const senderId = data.senderId
        const messageData = {
            chat: new Types.ObjectId(data.chatId),
            sender: new Types.ObjectId(senderId),
            reciever:new Types.ObjectId(data.receiverId), 
            content: data.content
        };

        // Create message
        const message = await this.messageRepository.createMessage(messageData);
        console.log(message,"this be the message")

        await this.chatRepository.updateLatestMessage(
            new Types.ObjectId(data.chatId), 
            message._id!
        );

        return message;
    }

    async getChatMessages(chatId: string): Promise<IMessage[]> {
        return await this.messageRepository.getMessagesByChatId(
            new Types.ObjectId(chatId)
        );
    }
}