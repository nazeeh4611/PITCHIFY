
import { Iadminrepository } from "../Domain/Interface/AdminInterface"


export class InvestorstatusUsecase{
    constructor(
        private adminrepo:Iadminrepository
    ){}


    async execute(status:string,email:string){
        try {
            const updatedData = await this.adminrepo.investorupdatestatus(status,email)
            return updatedData
        } catch (error) {
            
        }
    }
}