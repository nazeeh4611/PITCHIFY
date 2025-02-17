
import {IChatRepository} from "../Domain/Interface/ChatInterface"



export class getAllchatusecase{
    constructor(
    private chatrepo:IChatRepository
    ){}


    async execute(id:string){
        const result  = await this.chatrepo.getAll(id)
        console.log(result)
        return result
    }
}