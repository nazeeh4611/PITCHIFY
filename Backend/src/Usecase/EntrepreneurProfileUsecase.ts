import {IEntrepreneurRepository} from "../Domain/Interface/EntrepreneurInterface"


export class EntrepreneuProfileUsecase { 
    constructor(
        private Entrepreneurrepository : IEntrepreneurRepository
    ){}
    

    async execute(email:string):Promise<any>{

        try {
            const entrepreneur = await this.Entrepreneurrepository.findbyEmail(email)
            return {
                entrepreneur
            }
        } catch (error) {
            console.error("error occured in find data ")
        }
    }
}