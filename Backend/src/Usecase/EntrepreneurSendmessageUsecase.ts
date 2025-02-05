import { Types } from 'mongoose';
import { IMessageRepository } from '../Domain/Interface/MessageInterface';
import { IChatRepository } from '../Domain/Interface/ChatInterface';
import { IMessage } from '../Domain/entities/MessageEntity';
import { IEntrepreneurRepository} from '../Domain/Interface/EntrepreneurInterface';
export class EntrepreneurMessageUseCase {
    constructor(
        private messageRepository: IMessageRepository,
        private chatRepository: IChatRepository,
        private entrepreneurrepo:IEntrepreneurRepository
    ) {}

    async execute(data: {
        chatId: string;
        senderId: string;
        receiverId:string;
        content: string;
        createdAt:string;
  
    }):Promise<IMessage>{
        const senderId = data.senderId
        console.log(senderId,"this be the sender id")
        const messageData = {
            chat: new Types.ObjectId(data.chatId),
            sender: new Types.ObjectId(senderId),
            reciever:new Types.ObjectId(data.receiverId), 
            content: data.content
        };

        const message = await this.messageRepository.createMessage(messageData);

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