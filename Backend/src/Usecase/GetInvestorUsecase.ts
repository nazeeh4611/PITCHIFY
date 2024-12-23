import { Iadminrepository } from "../Domain/Interface/AdminInterface"


export class GetInvestorUsecase {
    constructor(
        private getinvestorrRepo:Iadminrepository
    ){}

    async execute():Promise<any>{
        try {
            return this.getinvestorrRepo.getAllInvestor()
        } catch (error) {
            console.error(error)
        }
    }
}