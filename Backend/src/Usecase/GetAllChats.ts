
import {IChatRepository} from "../Domain/Interface/ChatInterface"



export class getAllchatusecase{
    constructor(
    private chatrepo:IChatRepository
    ){}


    async execute(){
        const result  = await this.chatrepo.getAll()
        console.log(result)
        return result
    }
}