import {IInvestorRepository} from "../Domain/Interface/InvestorInterface"

export class investordetailsusecase{
    constructor(
        private investorrepo:IInvestorRepository
            ){}

     async execute(email:string){
        try {
            const details = await this.investorrepo.findbyEmail(email)
            return details
        } catch (error) {
            
        }
     }       
} 