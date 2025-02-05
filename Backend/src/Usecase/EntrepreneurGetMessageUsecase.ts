import { Types } from "mongoose"
import {IMessageRepository} from "../Domain/Interface/MessageInterface" 



export class EntrepreneurGetMessageUsecase{
    constructor(
        private messagerepo:IMessageRepository
    ){}


    async execute(chatId:Types.ObjectId){
        const message = await this.messagerepo.getMessagesByChatId(chatId)
        return message
    }
}