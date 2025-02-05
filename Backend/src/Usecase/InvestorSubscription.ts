
import {IInvestorRepository} from "../Domain/Interface/InvestorInterface"
export class Investorsubscritptionusecase{
    constructor(
        private investorrepo:IInvestorRepository
    ){}


    async execute(id:string,startdate:Date,enddate:Date,email:string){
        try {
            const investordata = await this.investorrepo.addpremium(id,startdate,enddate,email)
            return investordata
        } catch (error) {
            
        }
    }
}